// Image compositor using @cf-wasm/photon for Cloudflare Workers
import {
  initPhoton,
  photonWasmModule,
  PhotonImage,
  resize,
  watermark,
  SamplingFilter,
} from '@cf-wasm/photon';

let initPromise: Promise<unknown> | null = null;

/**
 * Initialize Photon WASM module (call once before using other functions)
 */
async function ensureInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = initPhoton(photonWasmModule).catch((error) => {
      // If initialization fails because it was already called, that's fine
      if (error?.message?.includes('already called')) {
        return;
      }
      // Reset promise so we can retry on other errors
      initPromise = null;
      throw error;
    });
  }
  await initPromise;
}

/**
 * Fetch an image and return as Uint8Array
 */
async function fetchImageBuffer(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

/**
 * Composite multiple card images into an overlapping stack (left to right, rightmost on top)
 */
export async function compositeCardImages(imageUrls: string[]): Promise<Uint8Array> {
  if (imageUrls.length === 0) {
    throw new Error('No images to composite');
  }

  await ensureInitialized();

  // Fetch all images in parallel
  const imageBuffers = await Promise.all(
    imageUrls.map(url => fetchImageBuffer(url))
  );

  // Card dimensions - Scryfall "normal" size
  const cardWidth = 488;
  const cardHeight = 680;

  // Each card overlaps by 60%, so visible portion is 40% of card width
  const overlapPercent = 0.60;
  const visibleWidth = Math.floor(cardWidth * (1 - overlapPercent));

  // Total width = first card full width + (remaining cards * visible portion)
  const totalWidth = cardWidth + (imageUrls.length - 1) * visibleWidth;

  // Create canvas image with RGBA pixels (4 bytes per pixel)
  const canvasPixels = new Uint8Array(totalWidth * cardHeight * 4);
  // Fill with dark background (RGBA: 47, 49, 54, 255 - Discord dark theme)
  for (let i = 0; i < canvasPixels.length; i += 4) {
    canvasPixels[i] = 47;     // R
    canvasPixels[i + 1] = 49; // G
    canvasPixels[i + 2] = 54; // B
    canvasPixels[i + 3] = 255; // A
  }
  const canvas = new PhotonImage(canvasPixels, totalWidth, cardHeight);

  // Process each image and composite onto canvas (left to right, later cards on top)
  for (let i = 0; i < imageBuffers.length; i++) {
    try {
      const img = PhotonImage.new_from_byteslice(imageBuffers[i]);
      const resized = resize(img, cardWidth, cardHeight, SamplingFilter.Lanczos3);

      // Each card is offset by visibleWidth from the previous
      const xPos = BigInt(i * visibleWidth);
      watermark(canvas, resized, xPos, BigInt(0));

      // Free memory
      img.free();
      resized.free();
    } catch (error) {
      console.error(`Failed to process image ${i}:`, error);
      // Continue with other images
    }
  }

  // Export as JPEG
  const result = canvas.get_bytes_jpeg(85);
  canvas.free();

  return result;
}

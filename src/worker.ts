import { generatePod } from './utils/podGenerator.js';
import { extractDeckId, fetchMoxfieldDeck, getRandomMainboardCards, getCommanderNames } from './utils/moxfield.js';
import { fetchCardImages } from './utils/scryfall.js';
import { compositeCardImages } from './utils/imageCompositor.js';

interface Env {
  DISCORD_PUBLIC_KEY: string;
  DISCORD_APPLICATION_ID: string;
  DISCORD_BOT_TOKEN: string;
  MOXFIELD_API_KEY: string;
  DECK_CACHE: KVNamespace;
}

const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
};

const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
  DEFERRED_UPDATE_MESSAGE: 6,
  UPDATE_MESSAGE: 7,
};

const ComponentType = {
  ACTION_ROW: 1,
  BUTTON: 2,
};

const ButtonStyle = {
  PRIMARY: 1,
  SECONDARY: 2,
  SUCCESS: 3,
  DANGER: 4,
};

const MAX_MULLIGANS = 7;

interface PodSeat {
  commander: string;
  isUser: boolean;
}

/**
 * Generate the playtest URL with moxfieldDeckId, pod, and hand
 */
function generatePlaytestUrl(
  moxfieldDeckId: string,
  pod: PodSeat[],
  handScryfallIds: string[]
): string {
  // Find user's seat (1-indexed)
  const userSeatIndex = pod.findIndex(seat => seat.isUser);
  const playerSeat = userSeatIndex + 1;

  // Get opponents (all non-user seats)
  const opponents = pod
    .filter(seat => !seat.isUser)
    .map(seat => seat.commander)
    .join('|');

  const podParam = `${playerSeat},${opponents}`;
  const handParam = handScryfallIds.join(',');

  const url = new URL('https://mulligan.eldrazi.dev/playtest');
  url.searchParams.set('moxfieldDeckId', moxfieldDeckId);
  url.searchParams.set('pod', podParam);
  url.searchParams.set('hand', handParam);

  return url.toString();
}

/**
 * Build embed description with both Moxfield and Playtest links
 */
function buildCardEmbedDescription(
  moxfieldDeckId: string,
  pod: PodSeat[],
  handScryfallIds: string[]
): string {
  const moxfieldUrl = `https://moxfield.com/decks/${moxfieldDeckId}`;
  const playtestUrl = generatePlaytestUrl(moxfieldDeckId, pod, handScryfallIds);

  return `[Moxfield](${moxfieldUrl}) • [Playtest](${playtestUrl})`;
}

/**
 * Get user seat from pod (1-indexed)
 */
function getUserSeat(pod: PodSeat[]): number {
  return pod.findIndex(seat => seat.isUser) + 1;
}

/**
 * Parse pod embed description to extract opponents
 * Formats:
 *   - "**1:** Commander1" (non-user)
 *   - "**2: Commander2 (You)**" (user with decklist)
 *   - "**1:** You" (user without decklist)
 */
function parsePodFromEmbed(description: string, userSeat: number): PodSeat[] {
  const lines = description.split('\n');
  const pod: PodSeat[] = [];

  for (let i = 0; i < lines.length && i < 4; i++) {
    const line = lines[i];
    // Extract commander name - handles both "**N:** Commander" and "**N: Commander (You)**"
    const match = line.match(/\*\*\d+:\s*\*?\*?\s*(.+)/);
    if (match) {
      let commander = match[1].trim();
      const isUser = i + 1 === userSeat || commander.includes('(You)');
      // Remove "(You)" suffix and any trailing ** if present
      commander = commander.replace(/\s*\(You\)\s*\*?\*?$/, '').trim();
      // Remove trailing ** if present (for non-user entries that might have it)
      commander = commander.replace(/\*\*$/, '').trim();
      pod.push({ commander, isUser });
    }
  }

  return pod;
}

/**
 * Get footer text for active hand based on mulligan count
 */
function getHandSizeText(mulliganCount: number): string {
  if (mulliganCount === 0) return 'First 7';
  if (mulliganCount === 1) return 'Second 7';
  return `Going to ${7 - mulliganCount + 1}`;
}

/**
 * Get footer text for kept hand based on mulligan count
 */
function getKeptText(mulliganCount: number): string {
  if (mulliganCount === 0) return 'Kept first 7';
  if (mulliganCount === 1) return 'Kept second 7';
  return `Kept ${7 - mulliganCount + 1}`;
}

// custom_id format: action:deckId:mulliganCount:channelId:messageId:userSeat
// userSeat is 1-4, pod opponents are parsed from the embed description when needed
function createCardButtons(
  deckId: string,
  mulliganCount: number,
  channelId: string,
  messageId: string,
  userSeat: number,
  disabled: boolean = false
): object[] {
  const mulliganDisabled = disabled || mulliganCount >= MAX_MULLIGANS;

  return [{
    type: ComponentType.ACTION_ROW,
    components: [
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.SUCCESS,
        label: 'Keep',
        custom_id: `keep:${deckId}:${mulliganCount}:${channelId}:${messageId}:${userSeat}`,
        disabled: disabled,
      },
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.DANGER,
        label: mulliganCount >= MAX_MULLIGANS ? 'Mulligan (max)' : 'Mulligan',
        custom_id: `mulligan:${deckId}:${mulliganCount}:${channelId}:${messageId}:${userSeat}`,
        disabled: mulliganDisabled,
      },
    ],
  }];
}

// Verify Discord signature using Web Crypto API
async function verifyDiscordSignature(
  body: string,
  signature: string,
  timestamp: string,
  publicKey: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const message = encoder.encode(timestamp + body);
    const signatureBytes = hexToBytes(signature);
    const publicKeyBytes = hexToBytes(publicKey);

    const key = await crypto.subtle.importKey(
      'raw',
      publicKeyBytes,
      { name: 'Ed25519', namedCurve: 'Ed25519' },
      false,
      ['verify']
    );

    return await crypto.subtle.verify('Ed25519', key, signatureBytes, message);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-Signature-Ed25519, X-Signature-Timestamp',
        },
      });
    }

    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Verify Discord signature
    const signature = request.headers.get('X-Signature-Ed25519');
    const timestamp = request.headers.get('X-Signature-Timestamp');
    const body = await request.text();

    if (!signature || !timestamp) {
      return new Response('Missing signature headers', { status: 401 });
    }

    const isValid = await verifyDiscordSignature(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
    if (!isValid) {
      return new Response('Invalid signature', { status: 401 });
    }

    // Parse interaction
    const interaction = JSON.parse(body);

    // Log guild info for analytics (guild_id is null for DMs)
    const guildId = interaction.guild_id || 'DM';
    const userId = interaction.member?.user?.id || interaction.user?.id || 'unknown';
    console.log(`[Analytics] Guild: ${guildId}, User: ${userId}, Type: ${interaction.type}`);

    // Handle PING from Discord
    if (interaction.type === InteractionType.PING) {
      return new Response(
        JSON.stringify({ type: InteractionResponseType.PONG }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle slash command
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      if (interaction.data.name === 'pod') {
        // Generate the pod
        const pod = generatePod(4);

        // Check for decklist option
        const decklistUrl = interaction.data.options?.find(
          (o: { name: string; value: string }) => o.name === 'decklist'
        )?.value as string | undefined;

        // Track user's commander name, deck, and deckId for later
        let userCommanderName = 'You';
        let deck: Awaited<ReturnType<typeof fetchMoxfieldDeck>> | null = null;
        let deckId: string | null = null;

        if (decklistUrl) {
          try {
            console.log('Processing decklist URL:', decklistUrl);

            deckId = extractDeckId(decklistUrl);
            if (!deckId) {
              return new Response(
                JSON.stringify({
                  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                  data: {
                    embeds: [{
                      title: '❌ Invalid Moxfield URL',
                      description: 'Could not parse the Moxfield deck URL. Please check the URL and try again.\n\nExpected format: `https://moxfield.com/decks/abc123`',
                      color: 0xED4245,
                    }],
                  },
                }),
                { headers: { 'Content-Type': 'application/json' } }
              );
            }
            console.log('Extracted deck ID:', deckId);

            deck = await fetchMoxfieldDeck(deckId, env.MOXFIELD_API_KEY, env.DECK_CACHE);
            console.log('Fetched deck:', deck.name);

            userCommanderName = getCommanderNames(deck);
            console.log('Commander name:', userCommanderName);
          } catch (error) {
            console.error('Failed to fetch deck:', error instanceof Error ? error.message : error);
            return new Response(
              JSON.stringify({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  embeds: [{
                    title: '❌ Moxfield Deck Not Found',
                    description: 'Could not fetch the deck from Moxfield. Please check the URL and try again.',
                    color: 0xED4245,
                  }],
                },
              }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          }
        }

        // Create pod list
        const podList = pod.map((seat, index) => {
          const seatNum = index + 1;
          if (seat.isUser) {
            if (userCommanderName === 'You') {
              return `**${seatNum}:** You`;
            }
            return `**${seatNum}: ${userCommanderName} (You)**`;
          }
          return `**${seatNum}:** ${seat.commander}`;
        }).join('\n');

        // Create pod embed
        const podEmbed = {
          title: '🎲 cEDH Pod Generated',
          description: podList,
          color: 0x5865F2,
        };

        // If no decklist, just return the pod embed publicly
        if (!deck || !deckId) {
          return new Response(
            JSON.stringify({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: { embeds: [podEmbed] },
            }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        }

        // With decklist: defer response, then send pod + card image via webhook
        const userId = interaction.member?.user?.id || interaction.user?.id;
        const interactionToken = interaction.token;
        const applicationId = env.DISCORD_APPLICATION_ID;
        const channelId = interaction.channel_id;

        // Get user seat for custom_id (1-4)
        const userSeat = getUserSeat(pod);

        // Process in background after deferring
        const processCommand = async () => {
          try {
            // Get card images
            const cards = getRandomMainboardCards(deck!, 7);
            console.log('Selected cards:', cards.length);

            let imageBytes: Uint8Array | null = null;
            let actualHandScryfallIds: string[] = [];

            if (cards.length > 0) {
              const requestedIds = cards.map(c => c.scryfallId).filter(Boolean);
              if (requestedIds.length > 0) {
                const cardData = await fetchCardImages(requestedIds);
                // Use the scryfall IDs from fetched data (maintains order, excludes not-found cards)
                actualHandScryfallIds = cardData.map(c => c.scryfallId);
                const imageUrls = cardData.map(c => c.imageUrl);

                if (imageUrls.length > 0) {
                  console.log('Compositing images...');
                  imageBytes = await compositeCardImages(imageUrls);
                }
              }
            }

            // Send the response via webhook with attachment
            const webhookUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;

            if (imageBytes) {
              // Build description with both Moxfield and Playtest links (uses actual fetched card IDs)
              const embedDescription = buildCardEmbedDescription(deckId!, pod, actualHandScryfallIds);

              // Create multipart form data with image attachment
              const formData = new FormData();
              formData.append('files[0]', new Blob([imageBytes], { type: 'image/jpeg' }), 'cards.jpg');
              formData.append('payload_json', JSON.stringify({
                embeds: [
                  podEmbed,
                  {
                    description: embedDescription,
                    image: { url: 'attachment://cards.jpg' },
                    color: 0x5865F2,
                    footer: { text: 'First 7' },
                  },
                ],
              }));

              await fetch(webhookUrl, {
                method: 'PATCH',
                body: formData,
              });
            } else {
              // No image, just send pod embed
              await fetch(webhookUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  embeds: [podEmbed],
                }),
              });
            }

            // Get the message ID for buttons
            const getOriginalUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;
            const originalMsgResponse = await fetch(getOriginalUrl, {
              headers: { 'Content-Type': 'application/json' },
            });

            if (!originalMsgResponse.ok) {
              console.error('Failed to get original message:', await originalMsgResponse.text());
              return;
            }

            const originalMsg = await originalMsgResponse.json() as { id: string };
            const messageId = originalMsg.id;

            // Add voting reactions
            const addReaction = async (emoji: string) => {
              const encodedEmoji = encodeURIComponent(emoji);
              const url = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}/reactions/${encodedEmoji}/@me`;
              const response = await fetch(url, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}`,
                },
              });
              if (!response.ok) {
                console.error(`Failed to add reaction ${emoji}: ${await response.text()}`);
              }
              await new Promise(resolve => setTimeout(resolve, 250));
            };

            await addReaction('👍');
            await addReaction('❌');

            // Send ephemeral follow-up with buttons
            if (userId && imageBytes) {
              const followUpUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}`;
              await fetch(followUpUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  content: '**Keep or Mulligan?** *(Others can vote with reactions on the post above)*',
                  components: createCardButtons(deckId!, 0, channelId, messageId, userSeat),
                  flags: 64, // EPHEMERAL
                }),
              });
            }
          } catch (error) {
            console.error('Command processing error:', error instanceof Error ? error.message : error);
            // Try to send error message
            const webhookUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;
            await fetch(webhookUrl, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                embeds: [podEmbed, {
                  title: '⚠️ Card Image Error',
                  description: 'Could not generate card image. The pod has been generated above.',
                  color: 0xFEE75C,
                }],
              }),
            });
          }
        };

        ctx.waitUntil(processCommand());

        // Return deferred response immediately
        return new Response(
          JSON.stringify({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Handle button clicks (buttons are ephemeral, only visible to invoker)
    if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
      const customId = interaction.data.custom_id as string;
      const [action, deckId, mulliganCountStr, channelId, messageId, userSeatStr] = customId.split(':');
      const mulliganCount = parseInt(mulliganCountStr, 10);
      const userSeat = parseInt(userSeatStr, 10);

      if (action === 'keep') {
        const editUrl = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`;

        // Get the existing message to preserve embeds and fetch the image
        const getMsgResponse = await fetch(editUrl, {
          headers: {
            'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}`,
          },
        });

        if (getMsgResponse.ok) {
          const existingMsg = await getMsgResponse.json() as {
            embeds: Array<{ description?: string; image?: { url: string }; color?: number }>;
            attachments?: Array<{ id: string; url: string }>;
          };
          const podEmbed = existingMsg.embeds[0];
          const cardEmbed = existingMsg.embeds[1];

          // Fetch the existing image from Discord CDN
          const imageUrl = cardEmbed?.image?.url || existingMsg.attachments?.[0]?.url;
          if (imageUrl) {
            const imageResponse = await fetch(imageUrl);
            if (imageResponse.ok) {
              const imageBytes = await imageResponse.arrayBuffer();

              // Re-upload with updated footer using FormData
              const formData = new FormData();
              formData.append('files[0]', new Blob([imageBytes], { type: 'image/jpeg' }), 'cards.jpg');
              formData.append('payload_json', JSON.stringify({
                embeds: [
                  podEmbed,
                  {
                    description: cardEmbed?.description,
                    image: { url: 'attachment://cards.jpg' },
                    color: 0x5865F2,
                    footer: { text: getKeptText(mulliganCount) },
                  },
                ],
              }));

              await fetch(editUrl, {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}`,
                },
                body: formData,
              });
            }
          }

          // Remove all reactions since decision is final
          const deleteReactionsUrl = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}/reactions`;
          await fetch(deleteReactionsUrl, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}`,
            },
          });
        }

        // Dismiss the ephemeral message
        return new Response(
          JSON.stringify({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
              content: '✅ Hand kept! Good luck!',
              components: [],
            },
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (action === 'mulligan') {
        const newMulliganCount = mulliganCount + 1;
        const interactionToken = interaction.token;
        const applicationId = env.DISCORD_APPLICATION_ID;

        // Do the heavy work in the background
        const doMulligan = async () => {
          try {
            const deck = await fetchMoxfieldDeck(deckId, env.MOXFIELD_API_KEY, env.DECK_CACHE);
            const cards = getRandomMainboardCards(deck, 7);
            const requestedIds = cards.map(c => c.scryfallId).filter(Boolean);
            const cardData = await fetchCardImages(requestedIds);
            // Use the scryfall IDs from fetched data (maintains order, excludes not-found cards)
            const actualHandScryfallIds = cardData.map(c => c.scryfallId);
            const imageUrls = cardData.map(c => c.imageUrl);

            if (imageUrls.length === 0) {
              throw new Error('No card images found');
            }

            const imageBytes = await compositeCardImages(imageUrls);

            // Edit the PUBLIC message with new card image using multipart form data
            const editUrl = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`;

            // Get the existing message to preserve the pod embed and parse pod data
            const getMsgResponse = await fetch(editUrl, {
              headers: {
                'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}`,
              },
            });

            if (getMsgResponse.ok) {
              const existingMsg = await getMsgResponse.json() as { embeds: Array<{ description?: string }> };
              const podEmbed = existingMsg.embeds[0];

              // Parse pod from embed description to generate playtest URL
              const pod = parsePodFromEmbed(podEmbed.description || '', userSeat);

              // Build new description with updated playtest URL for new hand (uses actual fetched card IDs)
              const embedDescription = buildCardEmbedDescription(deckId, pod, actualHandScryfallIds);

              // Create multipart form data with new image
              const formData = new FormData();
              formData.append('files[0]', new Blob([imageBytes], { type: 'image/jpeg' }), 'cards.jpg');
              formData.append('payload_json', JSON.stringify({
                embeds: [
                  podEmbed,
                  {
                    description: embedDescription,
                    image: { url: 'attachment://cards.jpg' },
                    color: 0x5865F2,
                    footer: { text: getHandSizeText(newMulliganCount) },
                  },
                ],
              }));

              await fetch(editUrl, {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}`,
                },
                body: formData,
              });

              // Reset reactions for new voting round
              const deleteUrl = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}/reactions`;
              await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}`,
                },
              });
              await new Promise(resolve => setTimeout(resolve, 300));

              // Re-add voting reactions
              const addReaction = async (emoji: string) => {
                const encodedEmoji = encodeURIComponent(emoji);
                const url = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}/reactions/${encodedEmoji}/@me`;
                await fetch(url, {
                  method: 'PUT',
                  headers: {
                    'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}`,
                  },
                });
                await new Promise(resolve => setTimeout(resolve, 250));
              };
              await addReaction('👍');
              await addReaction('❌');
            }

            // Update the ephemeral button message via webhook
            const webhookUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;
            await fetch(webhookUrl, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: `**Keep or Mulligan?** (Mulligan ${newMulliganCount})`,
                components: createCardButtons(deckId, newMulliganCount, channelId, messageId, userSeat),
              }),
            });
          } catch (error) {
            console.error('Mulligan error:', error instanceof Error ? error.message : error);
            // Update with error message
            const webhookUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;
            await fetch(webhookUrl, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: '⚠️ Error generating new hand. Try again.',
                components: createCardButtons(deckId, mulliganCount, channelId, messageId, userSeat),
              }),
            });
          }
        };

        ctx.waitUntil(doMulligan());

        // Immediately disable buttons while processing
        return new Response(
          JSON.stringify({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
              content: '⏳ **Shuffling new hand...**',
              components: createCardButtons(deckId, mulliganCount, channelId, messageId, userSeat, true),
            },
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response('Unknown interaction type', { status: 400 });
  },
};

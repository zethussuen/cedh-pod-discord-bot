// Scryfall API client

export interface ScryfallCard {
  name: string;
  imageUrl: string;
  scryfallId: string;
}

interface ScryfallApiCard {
  id: string;
  name: string;
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
  };
  card_faces?: Array<{
    image_uris?: {
      small?: string;
      normal?: string;
      large?: string;
    };
  }>;
}

interface ScryfallCollectionResponse {
  data: ScryfallApiCard[];
  not_found: Array<{ id: string }>;
}

/**
 * Fetch card images from Scryfall using the collection/batch API
 * Max 75 identifiers per request
 */
export async function fetchCardImages(scryfallIds: string[]): Promise<ScryfallCard[]> {
  if (scryfallIds.length === 0) {
    return [];
  }

  const requestBody = {
    identifiers: scryfallIds.map(id => ({ id }))
  };

  console.log('Scryfall request body:', JSON.stringify(requestBody));

  const response = await fetch('https://api.scryfall.com/cards/collection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'cedh-pod-discord-bot/1.0',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Scryfall error response:', errorText);
    throw new Error(`Scryfall API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json() as ScryfallCollectionResponse;

  // Create a map of scryfall ID -> card data for quick lookup
  const cardMap = new Map<string, ScryfallCard>();
  for (const card of data.data) {
    // Handle double-faced cards that have card_faces instead of image_uris
    let imageUrl: string | undefined;

    if (card.image_uris) {
      imageUrl = card.image_uris.normal || card.image_uris.large || card.image_uris.small;
    } else if (card.card_faces && card.card_faces[0]?.image_uris) {
      imageUrl = card.card_faces[0].image_uris.normal || card.card_faces[0].image_uris.large || card.card_faces[0].image_uris.small;
    }

    if (imageUrl) {
      cardMap.set(card.id, {
        name: card.name,
        imageUrl,
        scryfallId: card.id,
      });
    }
  }

  // Return cards in the same order as the input scryfallIds
  const result: ScryfallCard[] = [];
  for (const id of scryfallIds) {
    const card = cardMap.get(id);
    if (card) {
      result.push(card);
    }
  }

  return result;
}

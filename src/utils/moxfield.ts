// Moxfield API client

export interface MoxfieldCard {
  name: string;
  scryfallId: string;
}

export interface MoxfieldDeck {
  id: string;
  name: string;
  mainboard: Record<string, {
    quantity: number;
    card: {
      name: string;
      scryfall_id?: string;
      scryfallId?: string;
      id?: string;
    }
  }>;
  commanders: Record<string, {
    card: {
      name: string;
    }
  }>;
}

/**
 * Extract deck ID from a Moxfield URL
 */
export function extractDeckId(url: string): string | null {
  const match = url.match(/moxfield\.com\/decks\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

const DECK_CACHE_TTL = 300; // 5 minutes

/**
 * Fetch deck data from Moxfield API with optional KV caching
 */
export async function fetchMoxfieldDeck(
  deckId: string,
  apiKey: string,
  cache?: KVNamespace
): Promise<MoxfieldDeck> {
  const cacheKey = `deck:${deckId}`;

  // Try cache first
  if (cache) {
    const cached = await cache.get(cacheKey, 'json');
    if (cached) {
      console.log(`Cache hit for deck ${deckId}`);
      return cached as MoxfieldDeck;
    }
  }

  console.log(`Cache miss for deck ${deckId}, fetching from Moxfield`);
  const response = await fetch(`https://api2.moxfield.com/v2/decks/all/${deckId}`, {
    headers: {
      'User-Agent': `MoxKey; ${apiKey}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Moxfield API error: ${response.status}`);
  }

  const deck = await response.json() as MoxfieldDeck;

  // Store in cache
  if (cache) {
    await cache.put(cacheKey, JSON.stringify(deck), { expirationTtl: DECK_CACHE_TTL });
  }

  return deck;
}

/**
 * Get commander name(s) from the deck
 */
export function getCommanderNames(deck: MoxfieldDeck): string {
  const commanders = Object.values(deck.commanders || {});
  if (commanders.length === 0) {
    return deck.name;
  }
  return commanders.map(c => c.card.name).join(' / ');
}

/**
 * Get random cards from the mainboard
 * Expands cards by quantity (e.g., 13 Swamps becomes 13 individual entries)
 */
export function getRandomMainboardCards(deck: MoxfieldDeck, count: number = 7): MoxfieldCard[] {
  const mainboardEntries = Object.values(deck.mainboard || {});

  if (mainboardEntries.length === 0) {
    return [];
  }

  // Expand cards by quantity to create a full deck representation
  const expandedDeck: MoxfieldCard[] = [];
  for (const entry of mainboardEntries) {
    const quantity = entry.quantity || 1;
    const scryfallId = entry.card.scryfall_id || entry.card.scryfallId || entry.card.id || '';

    for (let i = 0; i < quantity; i++) {
      expandedDeck.push({
        name: entry.card.name,
        scryfallId,
      });
    }
  }

  console.log(`Deck has ${mainboardEntries.length} unique cards, ${expandedDeck.length} total cards`);

  // Fisher-Yates shuffle for true randomness
  for (let i = expandedDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [expandedDeck[i], expandedDeck[j]] = [expandedDeck[j], expandedDeck[i]];
  }

  return expandedDeck.slice(0, Math.min(count, expandedDeck.length));
}

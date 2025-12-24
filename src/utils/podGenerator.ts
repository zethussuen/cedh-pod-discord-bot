import { metaDecks, MetaDeck, MtgColor } from './metaDecks.js';

export interface Seat {
  isUser: boolean;
  commander: string;
  colors: MtgColor[];
  position: number;
}

export interface LockedSeat {
  isUser: boolean;
  commander: string;
  colors: MtgColor[];
  position: number;
}

// Pre-compute the total weight for normalization
const totalMetaShare = metaDecks.reduce((sum, deck) => sum + deck.metaShare, 0);

/**
 * Get a weighted random meta deck based on meta share percentages
 * Weights are normalized to handle cases where metaShare doesn't sum to 100
 */
export function getWeightedRandomMetaDeck(): MetaDeck {
  if (metaDecks.length === 0) {
    throw new Error('metaDecks array is empty');
  }

  const random = Math.random() * totalMetaShare;
  let cumulativeWeight = 0;

  for (const deck of metaDecks) {
    cumulativeWeight += deck.metaShare;
    if (random <= cumulativeWeight) {
      return deck;
    }
  }

  // Fallback to last deck (should rarely happen due to floating point)
  return metaDecks[metaDecks.length - 1];
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

/**
 * Generate a cEDH pod with the specified number of players
 * @param playerCount - Number of players (2-4)
 * @param lockedSeats - Array of seat objects to keep locked
 * @returns Array of seat objects
 */
export function generatePod(playerCount: number = 4, lockedSeats: LockedSeat[] = []): Seat[] {
  const seats: (Seat | undefined)[] = new Array(playerCount);
  const lockedPositions = new Set<number>();
  let hasUser = false;

  // Restore locked seats
  lockedSeats.forEach(seat => {
    if (seat.position < playerCount) {
      seats[seat.position] = seat;
      lockedPositions.add(seat.position);
      if (seat.isUser) hasUser = true;
    }
  });

  // Generate random commanders for unlocked seats
  const unlockedPositions: number[] = [];
  for (let i = 0; i < playerCount; i++) {
    if (!lockedPositions.has(i)) {
      unlockedPositions.push(i);
    }
  }

  const randomSeats: Omit<Seat, 'position'>[] = [];

  // Add "You" if not already in locked seats
  if (!hasUser) {
    randomSeats.push({ isUser: true, commander: 'You', colors: [] });
  }

  // Generate random opponents
  while (randomSeats.length < unlockedPositions.length) {
    const deck = getWeightedRandomMetaDeck();
    const commanderName = deck.commanders.join(' / ');
    randomSeats.push({
      isUser: false,
      commander: commanderName,
      colors: deck.colors,
    });
  }

  // Shuffle and assign to unlocked positions
  const shuffledSeats = shuffle(randomSeats);
  unlockedPositions.forEach((position, index) => {
    seats[position] = {
      ...shuffledSeats[index],
      position,
    };
  });

  // Add position to all seats and ensure no undefined values
  return seats.map((seat, index) => {
    if (!seat) {
      throw new Error(`Seat at position ${index} is undefined`);
    }
    return {
      ...seat,
      position: index,
    };
  });
}

/**
 * Convert color codes to emoji representation
 */
export function getColorEmojis(colors: MtgColor[]): string {
  if (!colors || colors.length === 0) return '⚪ Colorless';

  const colorMap: Record<MtgColor, string> = {
    'W': '⚪',
    'U': '🔵',
    'B': '⚫',
    'R': '🔴',
    'G': '🟢',
    'C': '◇',
  };

  return colors.map(c => colorMap[c] || c).join('');
}

import { calculateMean, calculateMedian, calculateMode } from "../utils/stats.js";

export interface MulliganSession {
  id: number;
  session_id: string;
  user_id: string;
  deck_id: number | null;
  moxfield_deck_id: string;
  channel_id: string;
  message_id: string | null;
  user_seat: number;
  mulligan_count: number;
  resolved: number;
  created_at: number;
  resolved_at: number | null;
}

export interface SessionContext {
  moxfieldDeckId: string;
  channelId: string;
  messageId: string | null;
  userSeat: number;
  deckId: number | null;
}

export interface DeckStats {
  totalHands: number;
  mean: number;
  median: number;
  mode: number;
  distribution: Map<number, number>;
}

export class SessionService {
  constructor(private db: D1Database) {}

  async create(
    userId: string,
    deckId: number | null,
    moxfieldDeckId: string,
    channelId: string,
    userSeat: number
  ): Promise<string> {
    const sessionId = crypto.randomUUID();

    // Use 0 for ad-hoc URLs (deckId === null) since deck_id column is NOT NULL
    const effectiveDeckId = deckId ?? 0;

    await this.db
      .prepare(
        `INSERT INTO mulligan_sessions (session_id, user_id, deck_id, moxfield_deck_id, channel_id, user_seat, mulligan_count, resolved)
         VALUES (?, ?, ?, ?, ?, ?, 0, 0)`
      )
      .bind(sessionId, userId, effectiveDeckId, moxfieldDeckId, channelId, userSeat)
      .run();

    return sessionId;
  }

  async updateMessageId(sessionId: string, messageId: string): Promise<void> {
    await this.db
      .prepare(`UPDATE mulligan_sessions SET message_id = ? WHERE session_id = ?`)
      .bind(messageId, sessionId)
      .run();
  }

  async getContext(sessionId: string): Promise<SessionContext | null> {
    const result = await this.db
      .prepare(
        `SELECT moxfield_deck_id, channel_id, message_id, user_seat, deck_id
         FROM mulligan_sessions WHERE session_id = ?`
      )
      .bind(sessionId)
      .first<{
        moxfield_deck_id: string;
        channel_id: string;
        message_id: string | null;
        user_seat: number;
        deck_id: number;
      }>();

    if (!result) return null;

    return {
      moxfieldDeckId: result.moxfield_deck_id,
      channelId: result.channel_id,
      messageId: result.message_id,
      userSeat: result.user_seat,
      // deck_id of 0 means ad-hoc URL (no saved deck)
      deckId: result.deck_id === 0 ? null : result.deck_id,
    };
  }

  async incrementMulligan(sessionId: string): Promise<number> {
    const result = await this.db
      .prepare(
        `UPDATE mulligan_sessions
         SET mulligan_count = mulligan_count + 1
         WHERE session_id = ?
         RETURNING mulligan_count`
      )
      .bind(sessionId)
      .first<{ mulligan_count: number }>();

    if (!result) {
      throw new Error("Session not found");
    }

    return result.mulligan_count;
  }

  async getMulliganCount(sessionId: string): Promise<number> {
    const result = await this.db
      .prepare(
        `SELECT mulligan_count FROM mulligan_sessions WHERE session_id = ?`
      )
      .bind(sessionId)
      .first<{ mulligan_count: number }>();

    if (!result) {
      throw new Error("Session not found");
    }

    return result.mulligan_count;
  }

  async resolve(sessionId: string): Promise<void> {
    await this.db
      .prepare(
        `UPDATE mulligan_sessions
         SET resolved = 1, resolved_at = unixepoch()
         WHERE session_id = ?`
      )
      .bind(sessionId)
      .run();
  }

  async getStats(deckId: number): Promise<DeckStats> {
    const result = await this.db
      .prepare(
        `SELECT mulligan_count FROM mulligan_sessions
         WHERE deck_id = ? AND resolved = 1`
      )
      .bind(deckId)
      .all<{ mulligan_count: number }>();

    const mulliganCounts = result.results.map((r) => r.mulligan_count);

    if (mulliganCounts.length === 0) {
      return {
        totalHands: 0,
        mean: 0,
        median: 0,
        mode: 0,
        distribution: new Map(),
      };
    }

    // Calculate distribution
    const distribution = new Map<number, number>();
    for (const count of mulliganCounts) {
      distribution.set(count, (distribution.get(count) || 0) + 1);
    }

    return {
      totalHands: mulliganCounts.length,
      mean: calculateMean(mulliganCounts),
      median: calculateMedian(mulliganCounts),
      mode: calculateMode(mulliganCounts),
      distribution,
    };
  }

  async resetStats(deckId: number): Promise<number> {
    const result = await this.db
      .prepare(
        `DELETE FROM mulligan_sessions WHERE deck_id = ? AND resolved = 1`
      )
      .bind(deckId)
      .run();

    return result.meta.changes;
  }

  async cleanupOldSessions(maxAgeHours: number = 24): Promise<number> {
    const cutoff = Math.floor(Date.now() / 1000) - maxAgeHours * 60 * 60;

    const result = await this.db
      .prepare(
        `DELETE FROM mulligan_sessions
         WHERE resolved = 0 AND created_at < ?`
      )
      .bind(cutoff)
      .run();

    return result.meta.changes;
  }
}

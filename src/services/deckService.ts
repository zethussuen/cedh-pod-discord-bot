import { extractDeckId } from "../utils/moxfield.js";

export interface Deck {
  id: number;
  user_id: string;
  name: string;
  moxfield_deck_id: string;
  moxfield_url: string;
  is_current: number;
  created_at: number;
  updated_at: number;
}

export class DeckService {
  constructor(private db: D1Database) {}

  async create(
    userId: string,
    name: string,
    moxfieldUrl: string
  ): Promise<Deck> {
    const moxfieldDeckId = extractDeckId(moxfieldUrl);
    if (!moxfieldDeckId) {
      throw new Error(
        "Invalid Moxfield URL. Expected format: https://moxfield.com/decks/abc123"
      );
    }

    const result = await this.db
      .prepare(
        `INSERT INTO decks (user_id, name, moxfield_deck_id, moxfield_url)
         VALUES (?, ?, ?, ?)
         RETURNING *`
      )
      .bind(userId, name, moxfieldDeckId, moxfieldUrl)
      .first<Deck>();

    if (!result) {
      throw new Error("Failed to create deck");
    }

    return result;
  }

  async list(userId: string): Promise<Deck[]> {
    const result = await this.db
      .prepare(
        `SELECT * FROM decks WHERE user_id = ? ORDER BY is_current DESC, name ASC`
      )
      .bind(userId)
      .all<Deck>();

    return result.results;
  }

  async getByName(userId: string, name: string): Promise<Deck | null> {
    const result = await this.db
      .prepare(`SELECT * FROM decks WHERE user_id = ? AND name = ?`)
      .bind(userId, name)
      .first<Deck>();

    return result;
  }

  async getCurrent(userId: string): Promise<Deck | null> {
    const result = await this.db
      .prepare(`SELECT * FROM decks WHERE user_id = ? AND is_current = 1`)
      .bind(userId)
      .first<Deck>();

    return result;
  }

  async setCurrent(userId: string, name: string): Promise<void> {
    // First verify the deck exists
    const deck = await this.getByName(userId, name);
    if (!deck) {
      throw new Error(`Deck "${name}" not found`);
    }

    // Clear current flag on all user's decks
    await this.db
      .prepare(`UPDATE decks SET is_current = 0 WHERE user_id = ?`)
      .bind(userId)
      .run();

    // Set current flag on specified deck
    await this.db
      .prepare(
        `UPDATE decks SET is_current = 1, updated_at = unixepoch() WHERE user_id = ? AND name = ?`
      )
      .bind(userId, name)
      .run();
  }

  async delete(userId: string, name: string): Promise<boolean> {
    const result = await this.db
      .prepare(`DELETE FROM decks WHERE user_id = ? AND name = ?`)
      .bind(userId, name)
      .run();

    return result.meta.changes > 0;
  }

  async rename(
    userId: string,
    oldName: string,
    newName: string
  ): Promise<boolean> {
    const result = await this.db
      .prepare(
        `UPDATE decks SET name = ?, updated_at = unixepoch() WHERE user_id = ? AND name = ?`
      )
      .bind(newName, userId, oldName)
      .run();

    return result.meta.changes > 0;
  }

  async updateUrl(
    userId: string,
    name: string,
    newUrl: string
  ): Promise<boolean> {
    const moxfieldDeckId = extractDeckId(newUrl);
    if (!moxfieldDeckId) {
      throw new Error(
        "Invalid Moxfield URL. Expected format: https://moxfield.com/decks/abc123"
      );
    }

    const result = await this.db
      .prepare(
        `UPDATE decks SET moxfield_url = ?, moxfield_deck_id = ?, updated_at = unixepoch()
         WHERE user_id = ? AND name = ?`
      )
      .bind(newUrl, moxfieldDeckId, userId, name)
      .run();

    return result.meta.changes > 0;
  }

  async searchByPrefix(userId: string, prefix: string): Promise<Deck[]> {
    const result = await this.db
      .prepare(
        `SELECT * FROM decks WHERE user_id = ? AND name LIKE ? ORDER BY name ASC LIMIT 25`
      )
      .bind(userId, `${prefix}%`)
      .all<Deck>();

    return result.results;
  }
}

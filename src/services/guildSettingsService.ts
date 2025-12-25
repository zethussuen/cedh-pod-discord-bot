export interface AllowedChannel {
  id: number;
  guild_id: string;
  channel_id: string;
  added_by: string;
  created_at: number;
}

export class GuildSettingsService {
  constructor(private db: D1Database) {}

  /**
   * Check if a channel is allowed for bot usage in a guild.
   * Returns true if:
   * - Guild has no restrictions (no entries in table), OR
   * - Channel is in the allowed list
   */
  async isChannelAllowed(guildId: string, channelId: string): Promise<boolean> {
    // First check if guild has any restrictions
    const restrictionCount = await this.db
      .prepare(
        `SELECT COUNT(*) as count FROM guild_allowed_channels WHERE guild_id = ?`
      )
      .bind(guildId)
      .first<{ count: number }>();

    // No restrictions = all channels allowed
    if (!restrictionCount || restrictionCount.count === 0) {
      return true;
    }

    // Check if this specific channel is allowed
    const allowed = await this.db
      .prepare(
        `SELECT 1 FROM guild_allowed_channels WHERE guild_id = ? AND channel_id = ?`
      )
      .bind(guildId, channelId)
      .first();

    return !!allowed;
  }

  /**
   * Get all allowed channels for a guild
   */
  async getAllowedChannels(guildId: string): Promise<AllowedChannel[]> {
    const result = await this.db
      .prepare(
        `SELECT * FROM guild_allowed_channels WHERE guild_id = ? ORDER BY created_at ASC`
      )
      .bind(guildId)
      .all<AllowedChannel>();

    return result.results;
  }

  /**
   * Add a channel to the allowed list
   */
  async addAllowedChannel(
    guildId: string,
    channelId: string,
    addedBy: string
  ): Promise<AllowedChannel> {
    const result = await this.db
      .prepare(
        `INSERT INTO guild_allowed_channels (guild_id, channel_id, added_by)
         VALUES (?, ?, ?)
         RETURNING *`
      )
      .bind(guildId, channelId, addedBy)
      .first<AllowedChannel>();

    if (!result) {
      throw new Error("Failed to add allowed channel");
    }

    return result;
  }

  /**
   * Remove a channel from the allowed list
   */
  async removeAllowedChannel(
    guildId: string,
    channelId: string
  ): Promise<boolean> {
    const result = await this.db
      .prepare(
        `DELETE FROM guild_allowed_channels WHERE guild_id = ? AND channel_id = ?`
      )
      .bind(guildId, channelId)
      .run();

    return result.meta.changes > 0;
  }

  /**
   * Clear all channel restrictions for a guild
   */
  async clearAllRestrictions(guildId: string): Promise<number> {
    const result = await this.db
      .prepare(`DELETE FROM guild_allowed_channels WHERE guild_id = ?`)
      .bind(guildId)
      .run();

    return result.meta.changes;
  }

  /**
   * Check if guild has any channel restrictions configured
   */
  async hasRestrictions(guildId: string): Promise<boolean> {
    const result = await this.db
      .prepare(
        `SELECT COUNT(*) as count FROM guild_allowed_channels WHERE guild_id = ?`
      )
      .bind(guildId)
      .first<{ count: number }>();

    return !!result && result.count > 0;
  }
}

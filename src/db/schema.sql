-- User's registered decks
CREATE TABLE IF NOT EXISTS decks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  moxfield_deck_id TEXT NOT NULL,
  moxfield_url TEXT NOT NULL,
  is_current INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Unique constraint: user can't have two decks with same name
CREATE UNIQUE INDEX IF NOT EXISTS idx_decks_user_name ON decks(user_id, name);

-- Index for listing all user's decks
CREATE INDEX IF NOT EXISTS idx_decks_user ON decks(user_id);

-- Mulligan sessions: tracks each /pod invocation until keep
CREATE TABLE IF NOT EXISTS mulligan_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  deck_id INTEGER,
  moxfield_deck_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  message_id TEXT,
  user_seat INTEGER NOT NULL,
  mulligan_count INTEGER DEFAULT 0,
  resolved INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  resolved_at INTEGER,
  FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE SET NULL
);

-- Index for looking up active session by session_id
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON mulligan_sessions(session_id);

-- Index for stats queries: get all resolved sessions for a deck
CREATE INDEX IF NOT EXISTS idx_sessions_deck_resolved ON mulligan_sessions(deck_id, resolved);

-- Cleanup index: find old unresolved sessions
CREATE INDEX IF NOT EXISTS idx_sessions_created ON mulligan_sessions(created_at);

-- Guild channel restrictions (whitelist approach)
-- If a guild has no entries, the bot works in all channels
-- If a guild has entries, the bot only works in those channels
CREATE TABLE IF NOT EXISTS guild_allowed_channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  added_by TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(guild_id, channel_id)
);

-- Index for quick lookup when checking if channel is allowed
CREATE INDEX IF NOT EXISTS idx_guild_channels_guild ON guild_allowed_channels(guild_id);

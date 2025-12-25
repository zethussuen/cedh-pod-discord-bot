# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Discord bot for generating competitive EDH (cEDH) pods with meta-weighted commander selection. It helps players organize casual games by creating balanced 4-player pods based on real tournament data from EDHTop16. The bot also supports deck management and mulligan stat tracking.

## Development Commands

```bash
npm install              # Install dependencies
npm run build            # Compile TypeScript
npm run typecheck        # Type check without emitting
npm run worker:dev       # Run locally with Wrangler
npm run worker:deploy    # Deploy to Cloudflare Workers
node dist/register.js    # Register slash commands with Discord
```

## Architecture

### Deployment

- **Cloudflare Workers** - Serverless deployment via Wrangler
- **Cloudflare D1** - SQLite database for deck management and stat tracking
- **Cloudflare KV** - Caching for Moxfield API responses

### Tech Stack

- **TypeScript** - Type-safe development
- **ES Modules** - Using `"type": "module"` in package.json
- **Discord Interactions API** - HTTP-based interactions (not WebSocket gateway)
- **Photon WASM** - Image composition for card hands

### Core Features

- **Pod Generation** - Creates 4-player pods with meta-weighted commanders
- **Deck Management** - Save, list, and manage Moxfield deck URLs
- **Mulligan Tracking** - Track keep/mulligan decisions and calculate stats
- **Card Hand Display** - Composite card images from Scryfall

## File Structure

```
cedh-pod-bot/
├── package.json
├── wrangler.toml               # Cloudflare Workers config
├── .env                        # Local secrets (not committed)
├── .env.example                # Template for environment variables
├── src/
│   ├── worker.ts               # Main Cloudflare Worker entry point
│   ├── register.ts             # Discord command registration script
│   ├── config.ts               # Environment configuration
│   ├── db/
│   │   └── schema.sql          # D1 database schema
│   ├── services/
│   │   ├── deckService.ts      # Deck CRUD operations
│   │   └── sessionService.ts   # Mulligan session tracking
│   ├── handlers/
│   │   ├── help.ts             # /pod help command
│   │   └── deck/
│   │       ├── create.ts       # /pod deck create
│   │       ├── list.ts         # /pod deck list
│   │       ├── use.ts          # /pod deck use
│   │       ├── delete.ts       # /pod deck delete
│   │       ├── rename.ts       # /pod deck rename
│   │       ├── stats.ts        # /pod deck stats
│   │       ├── setList.ts      # /pod deck set-list
│   │       └── autocomplete.ts # Deck name autocomplete
│   └── utils/
│       ├── metaDecks.ts        # Commander meta data (from EDHTop16)
│       ├── podGenerator.ts     # Core pod generation logic
│       ├── moxfield.ts         # Moxfield API client
│       ├── scryfall.ts         # Scryfall API client
│       ├── imageCompositor.ts  # Card image composition
│       └── stats.ts            # Mean/median/mode calculations
```

## Database Schema (D1)

### decks table
```sql
CREATE TABLE decks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,          -- Discord user ID
  name TEXT NOT NULL,             -- User-assigned deck name
  moxfield_deck_id TEXT NOT NULL, -- Extracted Moxfield deck ID
  moxfield_url TEXT NOT NULL,     -- Full Moxfield URL
  is_current INTEGER DEFAULT 0,   -- 1 if this is user's current deck
  created_at INTEGER,
  updated_at INTEGER
);
```

### mulligan_sessions table
```sql
CREATE TABLE mulligan_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE, -- UUID stored in button custom_id
  user_id TEXT NOT NULL,
  deck_id INTEGER NOT NULL,
  mulligan_count INTEGER DEFAULT 0,
  resolved INTEGER DEFAULT 0,      -- 1 when user clicks Keep
  created_at INTEGER,
  resolved_at INTEGER,
  FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);
```

## Command Reference

### `/pod generate [decklist]`
Generate a 4-player cEDH pod with meta-weighted commanders

**Options:**
- `decklist` (optional): Moxfield URL, saved deck name, or omit to use current deck

**Output:**
- Pod embed with 4 commanders
- Card hand image (if deck provided)
- Keep/Mulligan buttons (ephemeral)
- Voting reactions (👍/❌)

### `/pod deck create <name> <url>`
Register a new deck with a Moxfield URL

### `/pod deck list`
Show all your registered decks

### `/pod deck use <name>`
Set a deck as your current/default deck

### `/pod deck delete <name>`
Delete a registered deck

### `/pod deck rename <name> <new_name>`
Rename a deck

### `/pod deck set-list <name> <url>`
Update a deck's Moxfield URL

### `/pod deck stats [name]`
View mulligan stats (mean/median/mode) for a deck

### `/pod deck stats-reset <name>`
Reset mulligan stats for a deck

### `/pod help`
Show all available commands

## Session Tracking Flow

1. User runs `/pod generate MyDeck` with a saved deck
2. Worker creates `mulligan_session` row with `mulligan_count=0`
3. Session UUID stored in button `custom_id`
4. Each Mulligan click increments `mulligan_count` in D1
5. Keep click sets `resolved=1` - session now counts toward stats
6. Stats calculated from resolved sessions only

## Environment Variables

```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_PUBLIC_KEY=your_public_key_here
MOXFIELD_API_KEY=optional_api_key
```

## Wrangler Configuration

```toml
[[kv_namespaces]]
binding = "DECK_CACHE"

[[d1_databases]]
binding = "DB"
database_name = "cedh-pod-db"

[triggers]
crons = ["0 0 * * *"]  # Daily cleanup of stale sessions
```

## Key Functions

### `generatePod(playerCount, lockedSeats)`
Located in `src/utils/podGenerator.ts`

Generates a pod with:
- `playerCount` (2-4): Number of players
- `lockedSeats` (array): Seats to preserve during regeneration
- Returns: Array of seat objects with commander and isUser flag

### `resolveDeck(userId, input, db)`
Located in `src/worker.ts`

Resolves deck input to Moxfield deck ID:
- No input → use current deck from D1
- Moxfield URL → extract deck ID directly
- Deck name → lookup in D1

### `DeckService`
Located in `src/services/deckService.ts`

CRUD operations for user decks:
- `create()`, `list()`, `getByName()`, `getCurrent()`
- `setCurrent()`, `delete()`, `rename()`, `updateUrl()`
- `searchByPrefix()` for autocomplete

### `SessionService`
Located in `src/services/sessionService.ts`

Mulligan session tracking:
- `create()` - New session on pod generation
- `incrementMulligan()` - Called on mulligan button click
- `resolve()` - Called on keep button click
- `getStats()` - Calculate mean/median/mode
- `cleanupOldSessions()` - Cron job cleanup

## Data Sources

- **EDHTop16** - Commander meta shares based on tournament data
- **metaDecks array** - Located in `src/utils/metaDecks.ts`
- **Moxfield API** - Deck data and card lists
- **Scryfall API** - Card images

## Deployment

### Initial Setup
```bash
# Create D1 database
npx wrangler d1 create cedh-pod-db

# Apply schema
npx wrangler d1 execute cedh-pod-db --remote --file=./src/db/schema.sql

# Set secrets
npx wrangler secret put DISCORD_PUBLIC_KEY
npx wrangler secret put DISCORD_BOT_TOKEN
npx wrangler secret put DISCORD_APPLICATION_ID

# Deploy
npm run worker:deploy

# Register commands
npm run build && node dist/register.js
```

### Update Deployment
```bash
npm run worker:deploy
```

## Code Style

- TypeScript with strict mode
- ES Modules (import/export)
- Async/await for all async operations
- `any` type for Discord interaction objects (complex nested structure)
- Ephemeral messages for user-specific responses
- Error handling with try/catch blocks

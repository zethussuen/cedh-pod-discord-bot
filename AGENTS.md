# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Discord bot for generating competitive EDH (cEDH) pods with meta-weighted commander selection. It helps players organize casual games by creating balanced 2-4 player pods based on real tournament data from EDHTop16.

## Development Commands

```bash
npm install          # Install dependencies
npm start            # Start the bot
npm run dev          # Start with auto-reload (Node.js --watch)
```

## Architecture

### Bot Framework

- **discord.js v14** - Discord API library
- **ES Modules** - Using `"type": "module"` in package.json
- **Slash Commands** - Modern Discord command interface
- **Button Interactions** - For regenerating pods

### Core Logic

- **Weighted Random Selection** - Commanders selected based on `metaShare` percentages
- **Pod Generation** - Creates 2-4 player pods with one "You" seat and opponents
- **Fisher-Yates Shuffle** - Fair randomization of seat positions
- **In-Memory State** - Pod state stored in Map for button interactions (temporary)

### Data Sources

- **EDHTop16** - Commander meta shares based on last 3 months of tournament data
- **metaDecks array** - Located in `src/utils/metaDecks.js`
- **Last Updated** - 2025-11-08 (update monthly)

## File Structure

```
cedh-pod-bot/
├── package.json
├── .env                      # Bot token (not committed)
├── .env.example              # Template for environment variables
├── src/
│   ├── index.js              # Main bot entry point, event handlers
│   ├── config.js             # Environment configuration
│   ├── utils/
│   │   ├── metaDecks.js      # Commander meta data (from EDHTop16)
│   │   └── podGenerator.js   # Core pod generation logic
│   └── commands/
│       └── pod.js            # /pod slash command implementation
```

## Key Functions

### `generatePod(playerCount, lockedSeats)`
Located in `src/utils/podGenerator.js`

Generates a pod with:
- `playerCount` (2-4): Number of players
- `lockedSeats` (array): Seats to preserve during regeneration
- Returns: Array of seat objects with position, commander, colors, isUser flag

### `getWeightedRandomMetaDeck()`
Located in `src/utils/podGenerator.js`

- Uses cumulative weight distribution
- Generates random number 0-100
- Selects commander based on meta share percentages
- Returns: Deck object with commanders, colors, metaShare

### `createPodEmbed(pod)`
Located in `src/commands/pod.js`

- Creates Discord embed with formatted pod display
- Shows seat numbers, player/opponent labels
- Displays commander names and color identity
- Returns: EmbedBuilder object

## Discord Bot Setup

### Required Permissions
- Send Messages
- Embed Links
- Use Application Commands

### Environment Variables

```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
```

### Bot Intents
Only requires `GatewayIntentBits.Guilds` - no message content or members needed

## Command Reference

### `/pod`
Generate a cEDH pod with meta-weighted commanders

**Options:**
- `players` (integer, optional): Number of players (2-4), defaults to 4

**Output:**
- Discord embed with seat assignments
- Color identity emojis for each commander
- "You" designation for player seat
- Regenerate button for new randomization

## State Management

### Current Implementation (v1)
- In-memory `Map` stores pod state
- Key format: `${userId}-${timestamp}`
- Enables regenerate button functionality
- State expires when bot restarts

### Future Enhancements
- Redis/database for persistent state
- Lock/unlock individual seats
- Multi-message pod tracking
- Expiration cleanup after 1 hour

## Color Identity System

### Color Codes
- `W` - White ⚪
- `U` - Blue 🔵
- `B` - Black ⚫
- `R` - Red 🔴
- `G` - Green 🟢

### Display Format
- Array of color codes: `["B", "R", "U"]`
- Converted to emoji string: "⚫🔴🔵"
- Colorless (empty array): "⚪ Colorless"

## Meta Data Updates

**Update Frequency:** Monthly (approximately every 30 days)
**Last Updated:** 2025-11-08

### Update Process

1. Get updated meta data from the main web app repository
2. Update `src/utils/metaDecks.js` with new commander list
3. Ensure meta shares sum to 100%
4. Update "Last Updated" date in this file and in code comments

### Data Structure

```javascript
{
  commanders: ["Commander Name"],           // Array for partners
  metaShare: 14.48,                        // Percentage (0-100)
  colors: ["B", "R", "U", "W"],           // Color identity codes
}
```

## Error Handling

- Command execution errors reply with ephemeral error messages
- Button interaction errors show user-friendly messages
- Expired pod state shows "Use `/pod` to generate a new one"
- Invalid player counts constrained by slash command options (2-4)

## Deployment Notes

### Hosting Requirements
- Node.js 18+ runtime
- 24/7 uptime for persistent WebSocket connection
- Minimal resources (< 100MB RAM for small servers)

### Recommended Platforms
- Railway.app (easy deployment)
- Fly.io (free tier available)
- DigitalOcean App Platform
- Any VPS with Node.js

### Environment Setup
1. Set `DISCORD_BOT_TOKEN` and `DISCORD_CLIENT_ID` in hosting platform
2. Commands register globally on bot startup
3. No database required for basic functionality

## Future Features

### Planned Enhancements
- [ ] Lock/unlock individual seats
- [ ] Persistent state (Redis/database)
- [ ] Power level filtering (casual/competitive/fringe)
- [ ] Deck archetype categories (stax/combo/midrange/aggro)
- [ ] Custom commander pools (e.g., "only 2-color decks")
- [ ] Save/load pod configurations
- [ ] Share pod via image export

### Known Limitations
- State lost on bot restart
- No seat locking in v1
- Global command registration (takes ~1 hour to propagate changes)
- Button interactions expire with pod state

## Development Patterns

### Adding New Commands
1. Create file in `src/commands/`
2. Export `data` (SlashCommandBuilder) and `execute` function
3. Import and register in `src/index.js`
4. Add to commands collection
5. Bot auto-registers on startup

### Modifying Meta Data
- Only edit `src/utils/metaDecks.js`
- Ensure metaShare values sum to ~100%
- Follow existing object structure
- Color codes must be uppercase single letters

### Testing Locally
1. Create test Discord server
2. Invite bot with application commands scope
3. Commands register immediately for development
4. Use `npm run dev` for auto-reload during development

## Code Style

- ES Modules (import/export)
- Async/await for all Discord interactions
- Descriptive function names
- JSDoc comments for public functions
- Error handling with try/catch blocks
- Ephemeral replies for error messages

## Synchronization with Web App

This bot shares core logic with the main web application at `cedh-mulligan-trainer`. When making logic changes:

1. **Meta Data** - Copy updates from web app's `app/constants.ts` → `src/utils/metaDecks.js`
2. **Pod Logic** - Mirror changes to `generatePod()` function
3. **Color System** - Keep color identity codes consistent
4. **Meta Share Updates** - Coordinate monthly updates with web app

### Differences from Web App
- No React/Next.js dependencies
- Discord embeds instead of UI components
- Simpler state management (no seat locking yet)
- No database integration required
- Different visual representation (emojis vs. mana symbols)

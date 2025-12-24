# cEDH Pod Generator Discord Bot

A Discord bot that generates competitive EDH pods with meta-weighted commander selection based on EDHTop16 tournament data.

Built with TypeScript and Discord.js v14.

## Deployment Options

This bot can be deployed in two ways:

1. **Traditional Bot (Gateway)** - Run on your own server with persistent connection
2. **Cloudflare Workers** - Serverless deployment using webhooks (see [CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md))

## Setup (Traditional Bot)

1. **Create a Discord Application**
   - Go to https://discord.com/developers/applications
   - Click "New Application"
   - Go to "Bot" tab and create a bot
   - Copy the bot token

2. **Get your Client ID**
   - Go to "OAuth2" → "General"
   - Copy your "Client ID"

3. **Invite the bot**
   - Go to "OAuth2" → "URL Generator"
   - Select scopes: `bot`, `applications.commands`
   - Select permissions: `Send Messages`, `Embed Links`
   - Copy the generated URL and open it to invite the bot

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your bot token and client ID
   ```

6. **Build the project**
   ```bash
   npm run build
   ```

7. **Run the bot**
   ```bash
   npm start
   ```

## Development

For development with hot-reload:
```bash
npm run dev
```

To check types without building:
```bash
npm run typecheck
```

## Usage

In Discord, use the `/pod` command to generate a 4-player cEDH pod:

```
/pod
```

## Meta Data

Commander meta shares are based on the last 3 months of EDHTop16 tournament data. Update [src/utils/metaDecks.ts](src/utils/metaDecks.ts) periodically to keep data fresh.

## Features

✅ Meta-weighted commander selection
✅ 4-player pods
✅ Color identity display
✅ TypeScript for type safety
✅ Environment variable validation

## License

MIT
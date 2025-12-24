# Deploying to Cloudflare Workers

This bot can be deployed as a Cloudflare Worker using Discord's Interactions API (webhook-based) instead of the Gateway API.

## Prerequisites

1. **Cloudflare Account** - Sign up at https://dash.cloudflare.com/sign-up
2. **Discord Application** - Already created in main setup
3. **Wrangler CLI** - Already installed as dev dependency

## Setup Steps

### 1. Login to Cloudflare

```bash
npx wrangler login
```

This will open a browser window to authenticate with Cloudflare.

### 2. Set Environment Secrets

You need to set two secrets in Cloudflare:

```bash
# Set your Discord application's public key (found in Discord Developer Portal > General Information)
npx wrangler secret put DISCORD_PUBLIC_KEY

# Set your Discord application ID (Client ID)
npx wrangler secret put DISCORD_APPLICATION_ID
```

When prompted, paste the values from your Discord application settings.

### 3. Build TypeScript

```bash
npm run build
```

### 4. Register Slash Commands

Before deploying, register the `/pod` command with Discord:

```bash
npm run register
```

This uses your `.env` file to register commands globally.

### 5. Deploy to Cloudflare Workers

```bash
npm run worker:deploy
```

This will deploy your worker and give you a URL like:
```
https://cedh-pod-bot.<your-subdomain>.workers.dev
```

### 6. Configure Discord Interactions Endpoint

1. Go to Discord Developer Portal: https://discord.com/developers/applications
2. Select your application
3. Go to **General Information**
4. Under **Interactions Endpoint URL**, enter your worker URL:
   ```
   https://cedh-pod-bot.<your-subdomain>.workers.dev
   ```
5. Click **Save Changes**

Discord will send a PING request to verify the endpoint. If everything is configured correctly, it will show a green checkmark.

## Development

To test the worker locally:

```bash
npm run worker:dev
```

This starts a local development server. You can use a tool like [ngrok](https://ngrok.com/) to expose it for Discord webhook testing.

## Important Notes

### Differences from Gateway Bot

- **No persistent connection** - Workers respond to HTTP requests only
- **No event listeners** - Only handles slash commands and interactions
- **Stateless** - Each request is independent (no in-memory state)
- **No real-time events** - Can't listen to messages, reactions, etc.
- **Cost-effective** - Free tier includes 100,000 requests/day

### Advantages

✅ Serverless - no server management
✅ Auto-scaling - handles traffic spikes automatically
✅ Fast - edge deployment for low latency
✅ Free tier is generous for most use cases
✅ No need to keep a process running 24/7

### Limitations

❌ Can't use Discord Gateway features
❌ Can't listen to message events
❌ 3-second response time limit (use deferred responses for longer operations)

## Monitoring

View your worker logs and analytics:

```bash
npx wrangler tail
```

Or visit the Cloudflare dashboard: https://dash.cloudflare.com

## Updating the Bot

After making code changes:

1. Build: `npm run build`
2. Deploy: `npm run worker:deploy`

The worker will update instantly with zero downtime.

## Troubleshooting

### "Invalid signature" errors
- Check that `DISCORD_PUBLIC_KEY` is set correctly
- Verify the public key matches your Discord application

### "Unknown interaction" errors
- Ensure commands are registered: `npm run register`
- Check that the command name matches exactly

### Worker deployment fails
- Verify you're logged in: `npx wrangler whoami`
- Check `wrangler.toml` configuration
- Ensure no syntax errors: `npm run typecheck`

## Cost Estimate

Cloudflare Workers pricing (as of 2024):
- **Free tier**: 100,000 requests/day
- **Paid tier**: $5/month for 10 million requests

For a typical Discord bot with moderate usage, the free tier is usually sufficient.

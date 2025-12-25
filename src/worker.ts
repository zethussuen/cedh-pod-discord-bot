import { generatePod } from './utils/podGenerator.js';
import { extractDeckId, fetchMoxfieldDeck, getRandomMainboardCards, getCommanderNames } from './utils/moxfield.js';
import { fetchCardImages } from './utils/scryfall.js';
import { compositeCardImages } from './utils/imageCompositor.js';
import { DeckService } from './services/deckService.js';
import { SessionService } from './services/sessionService.js';
import { GuildSettingsService } from './services/guildSettingsService.js';
import { handleDeckCreate } from './handlers/deck/create.js';
import { handleDeckList } from './handlers/deck/list.js';
import { handleDeckUse } from './handlers/deck/use.js';
import { handleDeckDelete } from './handlers/deck/delete.js';
import { handleDeckRename } from './handlers/deck/rename.js';
import { handleDeckStats, handleDeckStatsReset } from './handlers/deck/stats.js';
import { handleDeckSetList } from './handlers/deck/setList.js';
import { handleDeckAutocomplete } from './handlers/deck/autocomplete.js';
import { handleHelp } from './handlers/help.js';
import { handleAdminChannelAdd } from './handlers/admin/channelAdd.js';
import { handleAdminChannelRemove } from './handlers/admin/channelRemove.js';
import { handleAdminChannelList } from './handlers/admin/channelList.js';
import { handleAdminChannelClear } from './handlers/admin/channelClear.js';

interface Env {
  DISCORD_PUBLIC_KEY: string;
  DISCORD_APPLICATION_ID: string;
  DISCORD_BOT_TOKEN: string;
  MOXFIELD_API_KEY: string;
  DECK_CACHE: KVNamespace;
  DB: D1Database;
}

const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
  APPLICATION_COMMAND_AUTOCOMPLETE: 4,
};

const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
  DEFERRED_UPDATE_MESSAGE: 6,
  UPDATE_MESSAGE: 7,
  APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: 8,
};

const ComponentType = {
  ACTION_ROW: 1,
  BUTTON: 2,
};

const ButtonStyle = {
  PRIMARY: 1,
  SECONDARY: 2,
  SUCCESS: 3,
  DANGER: 4,
};

const MAX_MULLIGANS = 7;

interface PodSeat {
  commander: string;
  isUser: boolean;
}

/**
 * Generate the playtest URL with moxfieldDeckId, pod, and hand
 */
function generatePlaytestUrl(
  moxfieldDeckId: string,
  pod: PodSeat[],
  handScryfallIds: string[]
): string {
  // Find user's seat (1-indexed)
  const userSeatIndex = pod.findIndex(seat => seat.isUser);
  const playerSeat = userSeatIndex + 1;

  // Get opponents (all non-user seats)
  const opponents = pod
    .filter(seat => !seat.isUser)
    .map(seat => seat.commander)
    .join('|');

  const podParam = `${playerSeat},${opponents}`;
  const handParam = handScryfallIds.join(',');

  const url = new URL('https://mulligan.eldrazi.dev/playtest');
  url.searchParams.set('moxfieldDeckId', moxfieldDeckId);
  url.searchParams.set('pod', podParam);
  url.searchParams.set('hand', handParam);

  return url.toString();
}

/**
 * Build embed description with both Moxfield and Playtest links
 */
function buildCardEmbedDescription(
  moxfieldDeckId: string,
  pod: PodSeat[],
  handScryfallIds: string[]
): string {
  const moxfieldUrl = `https://moxfield.com/decks/${moxfieldDeckId}`;
  const playtestUrl = generatePlaytestUrl(moxfieldDeckId, pod, handScryfallIds);

  return `[Moxfield](${moxfieldUrl}) • [Playtest](${playtestUrl})`;
}

/**
 * Get user seat from pod (1-indexed)
 */
function getUserSeat(pod: PodSeat[]): number {
  return pod.findIndex(seat => seat.isUser) + 1;
}

/**
 * Parse pod embed description to extract opponents
 */
function parsePodFromEmbed(description: string, userSeat: number): PodSeat[] {
  const lines = description.split('\n');
  const pod: PodSeat[] = [];

  for (let i = 0; i < lines.length && i < 4; i++) {
    const line = lines[i];
    const match = line.match(/\*\*\d+:\s*\*?\*?\s*(.+)/);
    if (match) {
      let commander = match[1].trim();
      const isUser = i + 1 === userSeat || commander.includes('(You)');
      commander = commander.replace(/\s*\(You\)\s*\*?\*?$/, '').trim();
      commander = commander.replace(/\*\*$/, '').trim();
      pod.push({ commander, isUser });
    }
  }

  return pod;
}

/**
 * Get footer text for active hand based on mulligan count
 */
function getHandSizeText(mulliganCount: number): string {
  if (mulliganCount === 0) return 'First 7';
  if (mulliganCount === 1) return 'Second 7';
  return `Going to ${7 - mulliganCount + 1}`;
}

/**
 * Get footer text for kept hand based on mulligan count
 */
function getKeptText(mulliganCount: number): string {
  if (mulliganCount === 0) return 'Kept first 7';
  if (mulliganCount === 1) return 'Kept second 7';
  return `Kept ${7 - mulliganCount + 1}`;
}

// custom_id format: action:sessionId (context stored in D1)
function createCardButtons(
  sessionId: string,
  mulliganCount: number,
  disabled: boolean = false
): object[] {
  const mulliganDisabled = disabled || mulliganCount >= MAX_MULLIGANS;

  return [{
    type: ComponentType.ACTION_ROW,
    components: [
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.SUCCESS,
        label: 'Keep',
        custom_id: `keep:${sessionId}`,
        disabled: disabled,
      },
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.DANGER,
        label: mulliganCount >= MAX_MULLIGANS ? 'Mulligan (max)' : 'Mulligan',
        custom_id: `mulligan:${sessionId}`,
        disabled: mulliganDisabled,
      },
    ],
  }];
}

// Verify Discord signature using Web Crypto API
async function verifyDiscordSignature(
  body: string,
  signature: string,
  timestamp: string,
  publicKey: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const message = encoder.encode(timestamp + body);
    const signatureBytes = hexToBytes(signature);
    const publicKeyBytes = hexToBytes(publicKey);

    const key = await crypto.subtle.importKey(
      'raw',
      publicKeyBytes,
      { name: 'Ed25519', namedCurve: 'Ed25519' },
      false,
      ['verify']
    );

    return await crypto.subtle.verify('Ed25519', key, signatureBytes, message);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

function jsonResponse(data: object): Response {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Resolve deck input: can be a Moxfield URL, a saved deck name, or empty (use current)
 */
async function resolveDeck(
  userId: string,
  input: string | undefined,
  db: D1Database
): Promise<{ moxfieldDeckId: string; moxfieldUrl: string; dbDeckId: number | null }> {
  const deckService = new DeckService(db);

  // No input: use current deck
  if (!input) {
    const current = await deckService.getCurrent(userId);
    if (!current) {
      throw new Error('No current deck set. Use `/pod deck use <name>` first, or provide a deck name/URL.');
    }
    return {
      moxfieldDeckId: current.moxfield_deck_id,
      moxfieldUrl: current.moxfield_url,
      dbDeckId: current.id,
    };
  }

  // Check if it's a URL
  if (input.includes('moxfield.com')) {
    const deckId = extractDeckId(input);
    if (!deckId) {
      throw new Error('Invalid Moxfield URL. Expected format: `https://moxfield.com/decks/abc123`');
    }
    return { moxfieldDeckId: deckId, moxfieldUrl: input, dbDeckId: null };
  }

  // Treat as deck name
  const deck = await deckService.getByName(userId, input);
  if (!deck) {
    throw new Error(`Deck "${input}" not found. Use \`/pod deck list\` to see your decks.`);
  }
  return {
    moxfieldDeckId: deck.moxfield_deck_id,
    moxfieldUrl: deck.moxfield_url,
    dbDeckId: deck.id,
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-Signature-Ed25519, X-Signature-Timestamp',
        },
      });
    }

    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Verify Discord signature
    const signature = request.headers.get('X-Signature-Ed25519');
    const timestamp = request.headers.get('X-Signature-Timestamp');
    const body = await request.text();

    if (!signature || !timestamp) {
      return new Response('Missing signature headers', { status: 401 });
    }

    const isValid = await verifyDiscordSignature(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
    if (!isValid) {
      return new Response('Invalid signature', { status: 401 });
    }

    // Parse interaction
    const interaction = JSON.parse(body);

    // Log guild info for analytics
    const guildId = interaction.guild_id || 'DM';
    const odUserId = interaction.member?.user?.id || interaction.user?.id || 'unknown';
    console.log(`[Analytics] Guild: ${guildId}, User: ${odUserId}, Type: ${interaction.type}`);

    // Handle PING from Discord
    if (interaction.type === InteractionType.PING) {
      return jsonResponse({ type: InteractionResponseType.PONG });
    }

    // Handle autocomplete
    if (interaction.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
      if (interaction.data.name === 'pod') {
        return handleDeckAutocomplete(interaction, env);
      }
    }

    // Handle slash command
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      if (interaction.data.name === 'pod') {
        const options = interaction.data.options || [];

        // Check for subcommand group: /pod admin ... (route first, bypasses channel restrictions)
        const adminGroup = options.find((o: { name: string }) => o.name === 'admin');
        if (adminGroup) {
          const subcommand = adminGroup.options?.[0];
          switch (subcommand?.name) {
            case 'channel-add':
              return handleAdminChannelAdd(interaction, env);
            case 'channel-remove':
              return handleAdminChannelRemove(interaction, env);
            case 'channel-list':
              return handleAdminChannelList(interaction, env);
            case 'channel-clear':
              return handleAdminChannelClear(interaction, env);
          }
        }

        // Check channel restrictions for non-admin commands in guilds
        const guildId = interaction.guild_id;
        const channelId = interaction.channel_id;

        if (guildId && channelId) {
          const guildSettings = new GuildSettingsService(env.DB);
          const isAllowed = await guildSettings.isChannelAllowed(guildId, channelId);

          if (!isAllowed) {
            const channels = await guildSettings.getAllowedChannels(guildId);
            const mentions = channels.map((c) => `<#${c.channel_id}>`).join(', ');

            return jsonResponse({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                embeds: [
                  {
                    title: 'Channel Restricted',
                    description: `This bot can only be used in: ${mentions}`,
                    color: 0xed4245,
                  },
                ],
                flags: 64,
              },
            });
          }
        }

        // Check for subcommand group: /pod deck ...
        const deckGroup = options.find((o: { name: string }) => o.name === 'deck');
        if (deckGroup) {
          const subcommand = deckGroup.options?.[0];
          switch (subcommand?.name) {
            case 'create':
              return handleDeckCreate(interaction, env);
            case 'list':
              return handleDeckList(interaction, env);
            case 'use':
              return handleDeckUse(interaction, env);
            case 'delete':
              return handleDeckDelete(interaction, env);
            case 'rename':
              return handleDeckRename(interaction, env);
            case 'stats':
              return handleDeckStats(interaction, env);
            case 'stats-reset':
              return handleDeckStatsReset(interaction, env);
            case 'set-list':
              return handleDeckSetList(interaction, env);
          }
        }

        // Check for /pod help
        const helpSubcommand = options.find((o: { name: string }) => o.name === 'help');
        if (helpSubcommand) {
          return handleHelp();
        }

        // Check for /pod generate [decklist]
        const generateSubcommand = options.find((o: { name: string }) => o.name === 'generate');
        if (generateSubcommand) {
          const userId = interaction.member?.user?.id || interaction.user?.id;
          console.log('[Generate] userId:', userId);
          console.log('[Generate] subcommand options:', JSON.stringify(generateSubcommand.options));

          if (!userId) {
            return jsonResponse({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: { content: 'Could not identify user.', flags: 64 },
            });
          }

          const decklistInput = generateSubcommand.options?.find(
            (o: { name: string }) => o.name === 'decklist'
          )?.value as string | undefined;
          console.log('[Generate] decklistInput:', decklistInput);

          // Generate the pod
          const pod = generatePod(4);

          // Resolve deck (saved name, URL, or current)
          let moxfieldDeckId: string | null = null;
          let dbDeckId: number | null = null;
          let userCommanderName = 'You';
          let deck: Awaited<ReturnType<typeof fetchMoxfieldDeck>> | null = null;

          if (decklistInput !== undefined || await new DeckService(env.DB).getCurrent(userId)) {
            try {
              const resolved = await resolveDeck(userId, decklistInput, env.DB);
              moxfieldDeckId = resolved.moxfieldDeckId;
              dbDeckId = resolved.dbDeckId;

              deck = await fetchMoxfieldDeck(moxfieldDeckId, env.MOXFIELD_API_KEY, env.DECK_CACHE);
              userCommanderName = getCommanderNames(deck);
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to resolve deck';

              // If no input and no current deck, just generate pod without hand
              if (!decklistInput && message.includes('No current deck')) {
                // Fall through to generate pod without deck
              } else {
                return jsonResponse({
                  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                  data: {
                    embeds: [{
                      title: '❌ Deck Error',
                      description: message,
                      color: 0xED4245,
                    }],
                    flags: 64,
                  },
                });
              }
            }
          }

          // Create pod list
          const podList = pod.map((seat, index) => {
            const seatNum = index + 1;
            if (seat.isUser) {
              if (userCommanderName === 'You') {
                return `**${seatNum}:** You`;
              }
              return `**${seatNum}: ${userCommanderName} (You)**`;
            }
            return `**${seatNum}:** ${seat.commander}`;
          }).join('\n');

          const podEmbed = {
            title: '🎲 cEDH Pod Generated',
            description: podList,
            color: 0x5865F2,
          };

          // If no deck, just return the pod embed publicly
          if (!deck || !moxfieldDeckId) {
            console.log('[Generate] No deck/moxfieldDeckId, returning pod only');
            return jsonResponse({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: { embeds: [podEmbed] },
            });
          }

          console.log('[Generate] Have deck, will show buttons. moxfieldDeckId:', moxfieldDeckId);

          // With deck: defer response, then send pod + card image via webhook
          const interactionToken = interaction.token;
          const applicationId = env.DISCORD_APPLICATION_ID;
          const channelId = interaction.channel_id;
          const userSeat = getUserSeat(pod);

          // Create session for tracking (always create, even for ad-hoc URLs)
          const sessionService = new SessionService(env.DB);
          const sessionId = await sessionService.create(
            userId,
            dbDeckId,
            moxfieldDeckId,
            channelId,
            userSeat
          );

          // Process in background after deferring
          const processCommand = async () => {
            try {
              const cards = getRandomMainboardCards(deck!, 7);
              let imageBytes: Uint8Array | null = null;
              let actualHandScryfallIds: string[] = [];

              if (cards.length > 0) {
                const requestedIds = cards.map(c => c.scryfallId).filter(Boolean);
                if (requestedIds.length > 0) {
                  const cardData = await fetchCardImages(requestedIds);
                  actualHandScryfallIds = cardData.map(c => c.scryfallId);
                  const imageUrls = cardData.map(c => c.imageUrl);

                  if (imageUrls.length > 0) {
                    imageBytes = await compositeCardImages(imageUrls);
                  }
                }
              }

              const webhookUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;

              if (imageBytes) {
                const embedDescription = buildCardEmbedDescription(moxfieldDeckId!, pod, actualHandScryfallIds);

                const formData = new FormData();
                formData.append('files[0]', new Blob([imageBytes], { type: 'image/jpeg' }), 'cards.jpg');
                formData.append('payload_json', JSON.stringify({
                  embeds: [
                    podEmbed,
                    {
                      description: embedDescription,
                      image: { url: 'attachment://cards.jpg' },
                      color: 0x5865F2,
                      footer: { text: 'First 7' },
                    },
                  ],
                }));

                await fetch(webhookUrl, { method: 'PATCH', body: formData });
              } else {
                await fetch(webhookUrl, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ embeds: [podEmbed] }),
                });
              }

              // Get the message ID for buttons
              const getOriginalUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;
              const originalMsgResponse = await fetch(getOriginalUrl, {
                headers: { 'Content-Type': 'application/json' },
              });

              if (!originalMsgResponse.ok) {
                console.error('Failed to get original message:', await originalMsgResponse.text());
                return;
              }

              const originalMsg = await originalMsgResponse.json() as { id: string };
              const messageId = originalMsg.id;

              // Store message ID in session
              await sessionService.updateMessageId(sessionId, messageId);

              // Add voting reactions
              const addReaction = async (emoji: string) => {
                const encodedEmoji = encodeURIComponent(emoji);
                const url = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}/reactions/${encodedEmoji}/@me`;
                await fetch(url, {
                  method: 'PUT',
                  headers: { 'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}` },
                });
                await new Promise(resolve => setTimeout(resolve, 250));
              };

              await addReaction('👍');
              await addReaction('❌');

              // Send ephemeral follow-up with buttons
              if (imageBytes) {
                const followUpUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}`;
                const followUpResponse = await fetch(followUpUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    content: '**Keep or Mulligan?** *(Others can vote with reactions on the post above)*',
                    components: createCardButtons(sessionId, 0),
                    flags: 64,
                  }),
                });
                if (!followUpResponse.ok) {
                  console.error('Failed to send ephemeral buttons:', await followUpResponse.text());
                }
              }
            } catch (error) {
              console.error('Command processing error:', error instanceof Error ? error.message : error);
              const webhookUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;
              await fetch(webhookUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  embeds: [podEmbed, {
                    title: '⚠️ Card Image Error',
                    description: 'Could not generate card image. The pod has been generated above.',
                    color: 0xFEE75C,
                  }],
                }),
              });
            }
          };

          ctx.waitUntil(processCommand());

          return jsonResponse({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
          });
        }
      }
    }

    // Handle button clicks
    if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
      const customId = interaction.data.custom_id as string;
      const [action, sessionId] = customId.split(':');

      const sessionService = new SessionService(env.DB);

      // Retrieve context from D1
      const context = await sessionService.getContext(sessionId);
      if (!context) {
        return jsonResponse({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: '❌ Session expired. Please generate a new pod.',
            components: [],
          },
        });
      }

      const { moxfieldDeckId, channelId, messageId, userSeat } = context;

      if (action === 'keep') {
        // Resolve session
        try {
          await sessionService.resolve(sessionId);
        } catch (error) {
          console.error('Failed to resolve session:', error);
        }

        if (!messageId) {
          return jsonResponse({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
              content: '✅ Hand kept! Good luck!',
              components: [],
            },
          });
        }

        const editUrl = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`;

        // Get mulligan count from session
        let mulliganCount = 0;
        try {
          mulliganCount = await sessionService.getMulliganCount(sessionId);
        } catch {
          // Session might not exist, use 0
        }

        const getMsgResponse = await fetch(editUrl, {
          headers: { 'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}` },
        });

        if (getMsgResponse.ok) {
          const existingMsg = await getMsgResponse.json() as {
            embeds: Array<{ description?: string; image?: { url: string }; color?: number }>;
            attachments?: Array<{ id: string; url: string }>;
          };
          const podEmbed = existingMsg.embeds[0];
          const cardEmbed = existingMsg.embeds[1];

          const imageUrl = cardEmbed?.image?.url || existingMsg.attachments?.[0]?.url;
          if (imageUrl) {
            const imageResponse = await fetch(imageUrl);
            if (imageResponse.ok) {
              const imageBytes = await imageResponse.arrayBuffer();

              const formData = new FormData();
              formData.append('files[0]', new Blob([imageBytes], { type: 'image/jpeg' }), 'cards.jpg');
              formData.append('payload_json', JSON.stringify({
                embeds: [
                  podEmbed,
                  {
                    description: cardEmbed?.description,
                    image: { url: 'attachment://cards.jpg' },
                    color: 0x5865F2,
                    footer: { text: getKeptText(mulliganCount) },
                  },
                ],
              }));

              await fetch(editUrl, {
                method: 'PATCH',
                headers: { 'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}` },
                body: formData,
              });
            }
          }

          // Remove reactions
          const deleteReactionsUrl = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}/reactions`;
          await fetch(deleteReactionsUrl, {
            method: 'DELETE',
            headers: { 'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}` },
          });
        }

        return jsonResponse({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: '✅ Hand kept! Good luck!',
            components: [],
          },
        });
      }

      if (action === 'mulligan') {
        if (!messageId) {
          return jsonResponse({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
              content: '❌ Session not ready. Please try again.',
              components: [],
            },
          });
        }

        // Increment mulligan count in D1
        let newMulliganCount = 1;
        try {
          newMulliganCount = await sessionService.incrementMulligan(sessionId);
        } catch (error) {
          console.error('Failed to increment mulligan:', error);
        }

        const interactionToken = interaction.token;
        const applicationId = env.DISCORD_APPLICATION_ID;

        const doMulligan = async () => {
          try {
            const deck = await fetchMoxfieldDeck(moxfieldDeckId, env.MOXFIELD_API_KEY, env.DECK_CACHE);
            const cards = getRandomMainboardCards(deck, 7);
            const requestedIds = cards.map(c => c.scryfallId).filter(Boolean);
            const cardData = await fetchCardImages(requestedIds);
            const actualHandScryfallIds = cardData.map(c => c.scryfallId);
            const imageUrls = cardData.map(c => c.imageUrl);

            if (imageUrls.length === 0) {
              throw new Error('No card images found');
            }

            const imageBytes = await compositeCardImages(imageUrls);

            const editUrl = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`;

            const getMsgResponse = await fetch(editUrl, {
              headers: { 'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}` },
            });

            if (getMsgResponse.ok) {
              const existingMsg = await getMsgResponse.json() as { embeds: Array<{ description?: string }> };
              const podEmbed = existingMsg.embeds[0];

              const pod = parsePodFromEmbed(podEmbed.description || '', userSeat);
              const embedDescription = buildCardEmbedDescription(moxfieldDeckId, pod, actualHandScryfallIds);

              const formData = new FormData();
              formData.append('files[0]', new Blob([imageBytes], { type: 'image/jpeg' }), 'cards.jpg');
              formData.append('payload_json', JSON.stringify({
                embeds: [
                  podEmbed,
                  {
                    description: embedDescription,
                    image: { url: 'attachment://cards.jpg' },
                    color: 0x5865F2,
                    footer: { text: getHandSizeText(newMulliganCount) },
                  },
                ],
              }));

              await fetch(editUrl, {
                method: 'PATCH',
                headers: { 'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}` },
                body: formData,
              });

              // Reset reactions
              const deleteUrl = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}/reactions`;
              await fetch(deleteUrl, {
                method: 'DELETE',
                headers: { 'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}` },
              });
              await new Promise(resolve => setTimeout(resolve, 300));

              const addReaction = async (emoji: string) => {
                const encodedEmoji = encodeURIComponent(emoji);
                const url = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}/reactions/${encodedEmoji}/@me`;
                await fetch(url, {
                  method: 'PUT',
                  headers: { 'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}` },
                });
                await new Promise(resolve => setTimeout(resolve, 250));
              };
              await addReaction('👍');
              await addReaction('❌');
            }

            // Update ephemeral button message
            const webhookUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;
            await fetch(webhookUrl, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: `**Keep or Mulligan?** (Mulligan ${newMulliganCount})`,
                components: createCardButtons(sessionId, newMulliganCount),
              }),
            });
          } catch (error) {
            console.error('Mulligan error:', error instanceof Error ? error.message : error);
            const webhookUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;

            // Get current count for retry button
            let currentCount = newMulliganCount - 1;
            try {
              currentCount = await sessionService.getMulliganCount(sessionId);
            } catch {
              // Use estimated count
            }

            await fetch(webhookUrl, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: '⚠️ Error generating new hand. Try again.',
                components: createCardButtons(sessionId, currentCount),
              }),
            });
          }
        };

        ctx.waitUntil(doMulligan());

        // Get current mulligan count for display
        let displayCount = 0;
        try {
          displayCount = await sessionService.getMulliganCount(sessionId);
        } catch {
          displayCount = newMulliganCount - 1;
        }

        return jsonResponse({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: '⏳ **Shuffling new hand...**',
            components: createCardButtons(sessionId, displayCount, true),
          },
        });
      }
    }

    return new Response('Unknown interaction type', { status: 400 });
  },

  // Scheduled handler for cleaning up old sessions
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    const sessionService = new SessionService(env.DB);
    const deletedCount = await sessionService.cleanupOldSessions(24);
    console.log(`[Scheduled] Cleaned up ${deletedCount} stale mulligan sessions`);
  },
};

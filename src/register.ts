import dotenv from 'dotenv';
dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_APPLICATION_ID = process.env.DISCORD_CLIENT_ID;

if (!DISCORD_TOKEN || !DISCORD_APPLICATION_ID) {
  throw new Error('Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID in environment');
}

const command = {
  name: 'pod',
  description: 'Generate a cEDH pod or manage your decks',
  type: 1, // CHAT_INPUT
  options: [
    // Subcommand group: /pod deck ...
    {
      name: 'deck',
      description: 'Manage your registered decks',
      type: 2, // SUB_COMMAND_GROUP
      options: [
        {
          name: 'create',
          description: 'Register a new deck',
          type: 1, // SUB_COMMAND
          options: [
            {
              name: 'name',
              description: 'Name for your deck',
              type: 3, // STRING
              required: true,
            },
            {
              name: 'url',
              description: 'Moxfield deck URL',
              type: 3, // STRING
              required: true,
            },
          ],
        },
        {
          name: 'list',
          description: 'List your registered decks',
          type: 1, // SUB_COMMAND
        },
        {
          name: 'use',
          description: 'Set a deck as your current/default deck',
          type: 1, // SUB_COMMAND
          options: [
            {
              name: 'name',
              description: 'Deck name to use',
              type: 3, // STRING
              required: true,
              autocomplete: true,
            },
          ],
        },
        {
          name: 'delete',
          description: 'Delete a registered deck',
          type: 1, // SUB_COMMAND
          options: [
            {
              name: 'name',
              description: 'Deck name to delete',
              type: 3, // STRING
              required: true,
              autocomplete: true,
            },
          ],
        },
        {
          name: 'rename',
          description: 'Rename a deck',
          type: 1, // SUB_COMMAND
          options: [
            {
              name: 'name',
              description: 'Current deck name',
              type: 3, // STRING
              required: true,
              autocomplete: true,
            },
            {
              name: 'new_name',
              description: 'New name for the deck',
              type: 3, // STRING
              required: true,
            },
          ],
        },
        {
          name: 'stats',
          description: 'View mulligan stats for a deck',
          type: 1, // SUB_COMMAND
          options: [
            {
              name: 'name',
              description: 'Deck name (optional, uses current deck if omitted)',
              type: 3, // STRING
              required: false,
              autocomplete: true,
            },
          ],
        },
        {
          name: 'stats-reset',
          description: 'Reset mulligan stats for a deck',
          type: 1, // SUB_COMMAND
          options: [
            {
              name: 'name',
              description: 'Deck name to reset stats for',
              type: 3, // STRING
              required: true,
              autocomplete: true,
            },
          ],
        },
        {
          name: 'set-list',
          description: "Update a deck's Moxfield URL",
          type: 1, // SUB_COMMAND
          options: [
            {
              name: 'name',
              description: 'Deck name',
              type: 3, // STRING
              required: true,
              autocomplete: true,
            },
            {
              name: 'url',
              description: 'New Moxfield deck URL',
              type: 3, // STRING
              required: true,
            },
          ],
        },
      ],
    },
    // Subcommand: /pod generate [decklist]
    {
      name: 'generate',
      description: 'Generate a 4-player cEDH pod with meta-weighted commanders',
      type: 1, // SUB_COMMAND
      options: [
        {
          name: 'decklist',
          description: 'Moxfield URL or saved deck name',
          type: 3, // STRING
          required: false,
          autocomplete: true,
        },
      ],
    },
    // Subcommand: /pod help
    {
      name: 'help',
      description: 'Show all available commands and how to use them',
      type: 1, // SUB_COMMAND
    },
    // Subcommand group: /pod admin ... (requires Manage Server permission)
    {
      name: 'admin',
      description: 'Admin-only server settings',
      type: 2, // SUB_COMMAND_GROUP
      options: [
        {
          name: 'channel-add',
          description: 'Add a channel where the bot can be used',
          type: 1, // SUB_COMMAND
          options: [
            {
              name: 'channel',
              description: 'Channel to allow',
              type: 7, // CHANNEL type
              required: true,
              channel_types: [0, 5], // GUILD_TEXT and GUILD_ANNOUNCEMENT
            },
          ],
        },
        {
          name: 'channel-remove',
          description: 'Remove a channel from allowed list',
          type: 1, // SUB_COMMAND
          options: [
            {
              name: 'channel',
              description: 'Channel to remove',
              type: 7, // CHANNEL type
              required: true,
              channel_types: [0, 5],
            },
          ],
        },
        {
          name: 'channel-list',
          description: 'List all allowed channels',
          type: 1, // SUB_COMMAND
        },
        {
          name: 'channel-clear',
          description: 'Remove all channel restrictions (bot works everywhere)',
          type: 1, // SUB_COMMAND
        },
      ],
      default_member_permissions: '32', // MANAGE_GUILD permission
    },
  ],
};

async function registerCommands() {
  const url = `https://discord.com/api/v10/applications/${DISCORD_APPLICATION_ID}/commands`;

  console.log('🔄 Registering slash commands...');

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${DISCORD_TOKEN}`,
    },
    body: JSON.stringify([command]),
  });

  if (response.ok) {
    const data = await response.json();
    console.log('✅ Slash commands registered successfully!');
    console.log(data);
  } else {
    const error = await response.text();
    console.error('❌ Error registering commands:', error);
    throw new Error(`Failed to register commands: ${response.status}`);
  }
}

registerCommands();

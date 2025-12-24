import dotenv from 'dotenv';
dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_APPLICATION_ID = process.env.DISCORD_CLIENT_ID;

if (!DISCORD_TOKEN || !DISCORD_APPLICATION_ID) {
  throw new Error('Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID in environment');
}

const command = {
  name: 'pod',
  description: 'Generate a 4-player cEDH pod with meta-weighted commanders',
  type: 1, // CHAT_INPUT
  options: [
    {
      name: 'decklist',
      description: 'Moxfield deck URL (e.g., https://moxfield.com/decks/abc123)',
      type: 3, // STRING type
      required: false,
    }
  ]
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

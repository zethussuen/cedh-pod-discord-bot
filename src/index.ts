import { Client, GatewayIntentBits, Collection, REST, Routes, Interaction } from 'discord.js';
import { config } from './config.js';
import * as podCommand from './commands/pod.js';

// Extend the Client type to include commands
declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, typeof podCommand>;
  }
}

// Create Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Setup commands collection
client.commands = new Collection();
client.commands.set(podCommand.data.name, podCommand);

// Register slash commands
async function registerCommands(): Promise<void> {
  const commands = [podCommand.data.toJSON()];

  const rest = new REST().setToken(config.token);

  try {
    console.log('🔄 Registering slash commands...');

    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands },
    );

    console.log('✅ Slash commands registered successfully!');
  } catch (error) {
    console.error('❌ Error registering commands:', error);
    throw error;
  }
}

// Handle interactions
client.on('interactionCreate', async (interaction: Interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error('Error executing command:', error);
      const errorMessage = {
        content: 'There was an error executing this command!',
        ephemeral: true
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  }
});

// Bot ready event
client.once('ready', () => {
  if (!client.user) {
    throw new Error('Client user is not available');
  }
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log(`🤖 Bot is ready to generate cEDH pods!`);
});

// Login and register commands
await registerCommands();
client.login(config.token);

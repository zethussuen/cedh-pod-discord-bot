import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import { generatePod, getColorEmojis, Seat } from '../utils/podGenerator.js';

export const data = new SlashCommandBuilder()
  .setName('pod')
  .setDescription('Generate a 4-player cEDH pod with meta-weighted commanders');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  // Always generate a 4-player pod
  const pod = generatePod(4);

  // Create embed
  const embed = createPodEmbed(pod);

  await interaction.reply({ embeds: [embed] });
}

function createPodEmbed(pod: Seat[]): EmbedBuilder {
  const podList = pod.map((seat, index) => {
    const seatNum = index + 1;
    if (seat.isUser) {
      return `**${seatNum}:** You`;
    }
    return `**${seatNum}:** ${seat.commander} ${getColorEmojis(seat.colors)}`;
  }).join('\n');

  const embed = new EmbedBuilder()
    .setTitle('🎲 Pod Generated')
    .setDescription(podList)
    .setColor(0x5865F2)
    .setTimestamp();

  return embed;
}

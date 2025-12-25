import { GuildSettingsService } from "../../services/guildSettingsService.js";

interface Env {
  DB: D1Database;
}

const MANAGE_GUILD = BigInt(0x20);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleAdminChannelList(
  interaction: any,
  env: Env
): Promise<Response> {
  const guildId = interaction.guild_id;

  if (!guildId) {
    return jsonResponse({
      type: 4,
      data: { content: "This command can only be used in a server.", flags: 64 },
    });
  }

  // Verify Manage Server permission
  const permissions = BigInt(interaction.member?.permissions || "0");
  if ((permissions & MANAGE_GUILD) === BigInt(0)) {
    return jsonResponse({
      type: 4,
      data: {
        content: "You need the **Manage Server** permission to use this command.",
        flags: 64,
      },
    });
  }

  const service = new GuildSettingsService(env.DB);
  const channels = await service.getAllowedChannels(guildId);

  if (channels.length === 0) {
    return jsonResponse({
      type: 4,
      data: {
        embeds: [
          {
            title: "Allowed Channels",
            description:
              "No channel restrictions configured.\n\nThe bot currently works in **all channels**.\n\nUse `/pod admin channel-add` to restrict to specific channels.",
            color: 0x5865f2,
          },
        ],
        flags: 64,
      },
    });
  }

  const channelList = channels.map((c) => `- <#${c.channel_id}>`).join("\n");

  return jsonResponse({
    type: 4,
    data: {
      embeds: [
        {
          title: "Allowed Channels",
          description: `The bot only responds in these channels:\n\n${channelList}`,
          color: 0x5865f2,
          footer: {
            text: `${channels.length} channel${channels.length === 1 ? "" : "s"} configured`,
          },
        },
      ],
      flags: 64,
    },
  });
}

function jsonResponse(data: object): Response {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

import { GuildSettingsService } from "../../services/guildSettingsService.js";

interface Env {
  DB: D1Database;
}

const MANAGE_GUILD = BigInt(0x20);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleAdminChannelAdd(
  interaction: any,
  env: Env
): Promise<Response> {
  const guildId = interaction.guild_id;
  const userId = interaction.member?.user?.id;

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

  // Extract channel from options
  // Structure: options[0] = admin group, options[0].options[0] = channel-add subcommand
  const adminGroup = interaction.data.options?.[0];
  const subcommand = adminGroup?.options?.[0];
  const channelId = subcommand?.options?.find(
    (o: { name: string }) => o.name === "channel"
  )?.value;

  if (!channelId) {
    return jsonResponse({
      type: 4,
      data: { content: "Please specify a channel.", flags: 64 },
    });
  }

  const service = new GuildSettingsService(env.DB);

  try {
    await service.addAllowedChannel(guildId, channelId, userId);
    return jsonResponse({
      type: 4,
      data: {
        embeds: [
          {
            title: "Channel Added",
            description: `<#${channelId}> has been added to the allowed channels list.\n\nThe bot will now only respond in allowed channels.`,
            color: 0x00ff00,
          },
        ],
        flags: 64,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add channel";

    if (message.includes("UNIQUE constraint")) {
      return jsonResponse({
        type: 4,
        data: {
          content: `<#${channelId}> is already in the allowed list.`,
          flags: 64,
        },
      });
    }

    return jsonResponse({
      type: 4,
      data: { content: `Error: ${message}`, flags: 64 },
    });
  }
}

function jsonResponse(data: object): Response {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

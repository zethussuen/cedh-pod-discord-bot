import { GuildSettingsService } from "../../services/guildSettingsService.js";

interface Env {
  DB: D1Database;
}

const MANAGE_GUILD = BigInt(0x20);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleAdminChannelRemove(
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

  // Extract channel from options
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
  const removed = await service.removeAllowedChannel(guildId, channelId);

  if (!removed) {
    return jsonResponse({
      type: 4,
      data: {
        content: `<#${channelId}> was not in the allowed list.`,
        flags: 64,
      },
    });
  }

  // Check if there are remaining restrictions
  const hasRestrictions = await service.hasRestrictions(guildId);
  const note = hasRestrictions
    ? ""
    : "\n\n**Note:** No channels are restricted now. The bot will work in all channels.";

  return jsonResponse({
    type: 4,
    data: {
      content: `<#${channelId}> has been removed from the allowed list.${note}`,
      flags: 64,
    },
  });
}

function jsonResponse(data: object): Response {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

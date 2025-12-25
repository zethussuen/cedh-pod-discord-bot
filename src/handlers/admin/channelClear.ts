import { GuildSettingsService } from "../../services/guildSettingsService.js";

interface Env {
  DB: D1Database;
}

const MANAGE_GUILD = BigInt(0x20);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleAdminChannelClear(
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
  const count = await service.clearAllRestrictions(guildId);

  if (count === 0) {
    return jsonResponse({
      type: 4,
      data: {
        content: "No channel restrictions were configured.",
        flags: 64,
      },
    });
  }

  return jsonResponse({
    type: 4,
    data: {
      content: `Cleared ${count} channel restriction${count === 1 ? "" : "s"}. The bot now works in all channels.`,
      flags: 64,
    },
  });
}

function jsonResponse(data: object): Response {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

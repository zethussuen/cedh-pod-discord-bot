import { DeckService } from "../../services/deckService.js";

interface Env {
  DB: D1Database;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleDeckRename(
  interaction: any,
  env: Env
): Promise<Response> {
  const userId = interaction.member?.user?.id ?? interaction.user?.id;
  if (!userId) {
    return jsonResponse({
      type: 4,
      data: { content: "Could not identify user.", flags: 64 },
    });
  }

  const deckGroup = interaction.data.options?.[0];
  const subcommand = deckGroup?.options?.[0];
  const options = subcommand?.options ?? [];
  const oldName = options.find((o: { name: string }) => o.name === "name")?.value;
  const newName = options.find((o: { name: string }) => o.name === "new_name")?.value;

  if (!oldName || !newName) {
    return jsonResponse({
      type: 4,
      data: { content: "Please provide both the current name and new name.", flags: 64 },
    });
  }

  const deckService = new DeckService(env.DB);

  try {
    const renamed = await deckService.rename(userId, oldName, newName);

    if (!renamed) {
      return jsonResponse({
        type: 4,
        data: {
          content: `Deck **${oldName}** not found. Use \`/pod deck list\` to see your decks.`,
          flags: 64,
        },
      });
    }

    return jsonResponse({
      type: 4,
      data: {
        content: `✏️ Deck renamed from **${oldName}** to **${newName}**.`,
        flags: 64,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to rename deck";

    if (message.includes("UNIQUE constraint")) {
      return jsonResponse({
        type: 4,
        data: {
          content: `You already have a deck named **${newName}**. Choose a different name.`,
          flags: 64,
        },
      });
    }

    return jsonResponse({
      type: 4,
      data: { content: `❌ ${message}`, flags: 64 },
    });
  }
}

function jsonResponse(data: object): Response {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

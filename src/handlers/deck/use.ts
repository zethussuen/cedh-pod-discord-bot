import { DeckService } from "../../services/deckService.js";

interface Env {
  DB: D1Database;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleDeckUse(
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
  const name = options.find((o: { name: string }) => o.name === "name")?.value;

  if (!name) {
    return jsonResponse({
      type: 4,
      data: { content: "Please provide a deck name.", flags: 64 },
    });
  }

  const deckService = new DeckService(env.DB);

  try {
    await deckService.setCurrent(userId, name);
    return jsonResponse({
      type: 4,
      data: {
        content: `⭐ **${name}** is now your current deck. You can now use \`/pod generate\` without specifying a deck.`,
        flags: 64,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to set current deck";
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

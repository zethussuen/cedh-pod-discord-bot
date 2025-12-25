import { DeckService } from "../../services/deckService.js";

interface Env {
  DB: D1Database;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleDeckDelete(
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
  const deleted = await deckService.delete(userId, name);

  if (!deleted) {
    return jsonResponse({
      type: 4,
      data: {
        content: `Deck **${name}** not found. Use \`/pod deck list\` to see your decks.`,
        flags: 64,
      },
    });
  }

  return jsonResponse({
    type: 4,
    data: {
      content: `🗑️ Deck **${name}** has been deleted.`,
      flags: 64,
    },
  });
}

function jsonResponse(data: object): Response {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

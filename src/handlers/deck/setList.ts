import { DeckService } from "../../services/deckService.js";

interface Env {
  DB: D1Database;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleDeckSetList(
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
  const url = options.find((o: { name: string }) => o.name === "url")?.value;

  if (!name || !url) {
    return jsonResponse({
      type: 4,
      data: { content: "Please provide both a deck name and URL.", flags: 64 },
    });
  }

  const deckService = new DeckService(env.DB);

  try {
    const updated = await deckService.updateUrl(userId, name, url);

    if (!updated) {
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
        content: `🔗 Deck **${name}** now points to:\n${url}`,
        flags: 64,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update deck URL";
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

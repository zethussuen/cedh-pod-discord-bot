import { DeckService } from "../../services/deckService.js";

interface Env {
  DB: D1Database;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleDeckCreate(
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

  // Structure: options[0] = deck group, options[0].options[0] = create subcommand
  const deckGroup = interaction.data.options?.[0];
  const subcommand = deckGroup?.options?.[0];
  const options = subcommand?.options ?? [];
  const name = options.find((o: { name: string }) => o.name === "name")?.value;
  const url = options.find((o: { name: string }) => o.name === "url")?.value;

  if (!name || !url) {
    return jsonResponse({
      type: 4,
      data: { content: "Please provide both a name and a Moxfield URL.", flags: 64 },
    });
  }

  const deckService = new DeckService(env.DB);

  try {
    const deck = await deckService.create(userId, name, url);
    return jsonResponse({
      type: 4,
      data: {
        embeds: [
          {
            title: "✅ Deck Created",
            description: `Your deck **${deck.name}** has been registered.`,
            fields: [
              { name: "Moxfield", value: deck.moxfield_url, inline: false },
            ],
            color: 0x00ff00,
          },
        ],
        flags: 64,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create deck";

    // Check for unique constraint violation
    if (message.includes("UNIQUE constraint")) {
      return jsonResponse({
        type: 4,
        data: {
          content: `You already have a deck named **${name}**. Choose a different name.`,
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

import { DeckService, Deck } from "../../services/deckService.js";

interface Env {
  DB: D1Database;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleDeckList(
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

  const deckService = new DeckService(env.DB);
  const decks = await deckService.list(userId);

  if (decks.length === 0) {
    return jsonResponse({
      type: 4,
      data: {
        content:
          "You have no registered decks. Use `/pod deck create` to add one.",
        flags: 64,
      },
    });
  }

  const deckLines = decks.map((deck: Deck) => {
    const currentMarker = deck.is_current ? " ⭐ (current)" : "";
    return `• **${deck.name}**${currentMarker}\n  └ [Moxfield](${deck.moxfield_url})`;
  });

  return jsonResponse({
    type: 4,
    data: {
      embeds: [
        {
          title: "📚 Your Registered Decks",
          description: deckLines.join("\n\n"),
          color: 0x5865f2,
          footer: { text: `${decks.length} deck${decks.length === 1 ? "" : "s"} registered` },
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

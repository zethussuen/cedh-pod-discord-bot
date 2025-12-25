import { DeckService } from "../../services/deckService.js";
import { SessionService } from "../../services/sessionService.js";

interface Env {
  DB: D1Database;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleDeckStats(
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

  const deckService = new DeckService(env.DB);
  const sessionService = new SessionService(env.DB);

  // Get the deck (by name or current)
  let deck;
  if (name) {
    deck = await deckService.getByName(userId, name);
    if (!deck) {
      return jsonResponse({
        type: 4,
        data: {
          content: `Deck **${name}** not found. Use \`/pod deck list\` to see your decks.`,
          flags: 64,
        },
      });
    }
  } else {
    deck = await deckService.getCurrent(userId);
    if (!deck) {
      return jsonResponse({
        type: 4,
        data: {
          content: "No current deck set. Use `/pod deck use <name>` to set one, or specify a deck name.",
          flags: 64,
        },
      });
    }
  }

  const stats = await sessionService.getStats(deck.id);

  if (stats.totalHands === 0) {
    return jsonResponse({
      type: 4,
      data: {
        embeds: [
          {
            title: `📊 Mulligan Stats for "${deck.name}"`,
            description: "No hands kept yet. Generate pods with `/pod generate` and click **Keep** to track stats.",
            color: 0x5865f2,
          },
        ],
        flags: 64,
      },
    });
  }

  // Build distribution string
  const distributionLines: string[] = [];
  const sortedCounts = Array.from(stats.distribution.entries()).sort((a, b) => a[0] - b[0]);
  for (const [mulligans, count] of sortedCounts) {
    const cardsKept = 7 - mulligans;
    const percentage = ((count / stats.totalHands) * 100).toFixed(1);
    distributionLines.push(`Kept ${cardsKept} cards: ${count} (${percentage}%)`);
  }

  return jsonResponse({
    type: 4,
    data: {
      embeds: [
        {
          title: `📊 Mulligan Stats for "${deck.name}"`,
          fields: [
            {
              name: "Total Hands Kept",
              value: stats.totalHands.toString(),
              inline: true,
            },
            {
              name: "Mulligans Before Keeping",
              value: [
                `• Mean: ${stats.mean.toFixed(2)}`,
                `• Median: ${stats.median}`,
                `• Mode: ${stats.mode}`,
              ].join("\n"),
              inline: true,
            },
            {
              name: "Distribution",
              value: distributionLines.join("\n") || "No data",
              inline: false,
            },
          ],
          color: 0x5865f2,
        },
      ],
      flags: 64,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleDeckStatsReset(
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
  const sessionService = new SessionService(env.DB);

  const deck = await deckService.getByName(userId, name);
  if (!deck) {
    return jsonResponse({
      type: 4,
      data: {
        content: `Deck **${name}** not found. Use \`/pod deck list\` to see your decks.`,
        flags: 64,
      },
    });
  }

  const deletedCount = await sessionService.resetStats(deck.id);

  return jsonResponse({
    type: 4,
    data: {
      content: `🔄 Stats reset for **${name}**. ${deletedCount} recorded hand${deletedCount === 1 ? "" : "s"} cleared.`,
      flags: 64,
    },
  });
}

function jsonResponse(data: object): Response {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

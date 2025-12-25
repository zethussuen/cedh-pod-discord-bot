export async function handleHelp(): Promise<Response> {
  const helpText = [
    "**Pod Generation**",
    "`/pod generate [decklist]` — Generate a 4-player cEDH pod",
    "  • With no argument: uses your current deck",
    "  • With deck name: uses a saved deck",
    "  • With Moxfield URL: uses that deck (no stats)",
    "",
    "**Deck Management**",
    "`/pod deck create <name> <url>` — Register a new deck",
    "`/pod deck list` — List your registered decks",
    "`/pod deck use <name>` — Set a deck as your current deck",
    "`/pod deck delete <name>` — Delete a registered deck",
    "`/pod deck rename <name> <new_name>` — Rename a deck",
    "`/pod deck set-list <name> <url>` — Update a deck's Moxfield URL",
    "",
    "**Stats Tracking**",
    "`/pod deck stats [name]` — View mulligan stats for a deck",
    "`/pod deck stats-reset <name>` — Reset stats for a deck",
    "",
    "**How Stats Work**",
    "When you use a saved deck with `/pod generate`, each hand you **Keep** is recorded. Stats show how many mulligans you take on average before keeping.",
    "",
    "**Server Admin** *(Manage Server permission required)*",
    "`/pod admin channel-add <channel>` — Restrict bot to specific channels",
    "`/pod admin channel-remove <channel>` — Remove a channel from allowed list",
    "`/pod admin channel-list` — View all allowed channels",
    "`/pod admin channel-clear` — Remove all restrictions",
  ].join("\n");

  return jsonResponse({
    type: 4,
    data: {
      embeds: [
        {
          title: "🎴 cEDH Pod Bot Commands",
          description: helpText,
          color: 0x5865f2,
          footer: { text: "Tip: Use a saved deck to track your mulligan stats!" },
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

import { DeckService } from "../../services/deckService.js";

interface Env {
  DB: D1Database;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleDeckAutocomplete(
  interaction: any,
  env: Env
): Promise<Response> {
  const userId = interaction.member?.user?.id ?? interaction.user?.id;
  if (!userId) {
    return jsonResponse({
      type: 8,
      data: { choices: [] },
    });
  }

  // Find the focused option (the one the user is typing in)
  let focusedValue = "";

  const topOptions = interaction.data.options ?? [];
  for (const topOpt of topOptions) {
    // Check subcommand group options
    if (topOpt.options) {
      for (const subOpt of topOpt.options) {
        // Check subcommand options
        if (subOpt.options) {
          for (const opt of subOpt.options) {
            if (opt.focused) {
              focusedValue = opt.value || "";
              break;
            }
          }
        }
      }
    }
    // Check direct subcommand options (for /pod generate)
    if (topOpt.name === "generate" && topOpt.options) {
      for (const opt of topOpt.options as Array<{ name: string; value: string; focused?: boolean }>) {
        if (opt.focused) {
          focusedValue = opt.value || "";
          break;
        }
      }
    }
  }

  const deckService = new DeckService(env.DB);
  const decks = await deckService.searchByPrefix(userId, focusedValue);

  const choices = decks.map((deck) => ({
    name: deck.is_current ? `${deck.name} ⭐` : deck.name,
    value: deck.name,
  }));

  return jsonResponse({
    type: 8, // APPLICATION_COMMAND_AUTOCOMPLETE_RESULT
    data: { choices },
  });
}

function jsonResponse(data: object): Response {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

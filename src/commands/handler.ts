import { Commands } from "../consts/commands.ts";
import { handlePing } from "./util.ts";
import type { APIApplicationCommandInteractionData } from "discord-api-types/v10";

export function handleApplicationCommands(
  data: APIApplicationCommandInteractionData,
) {
  const { name } = data;

  switch (name) {
    case Commands.Ping:
      return { status: 200, body: handlePing() };

    default:
      return { status: 400, body: { error: "unknown command" } };
  }
}

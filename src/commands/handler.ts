import type {
  APIGuildMember,
  APIUser,
  APIUserApplicationCommandInteractionData,
} from "discord-api-types/v10";
import { Commands } from "../consts/commands.ts";
import { handlePing } from "./util.ts";
import { USER_SERVICE } from "../db/init.ts";
import { handleDiceCommand } from "./games.ts";

export function handleApplicationCommands(
  data: APIUserApplicationCommandInteractionData,
  user?: APIUser,
  member?: APIGuildMember,
): { status: number; body: Record<string, unknown> } {
  const { name } = data;

  const commandUser = member?.user ?? user;

  if (commandUser) {
    USER_SERVICE.upsertUser(commandUser);
  }

  switch (name) {
    case Commands.Ping:
      return handlePing();

    case Commands.Dice:
      return handleDiceCommand(data);

    default:
      return { status: 400, body: { error: "unknown command" } };
  }
}

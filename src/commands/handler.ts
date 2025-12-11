import type {
  APIGuildMember,
  APIUser,
  APIUserApplicationCommandInteractionData,
} from "discord-api-types/v10";
import { Commands } from "../consts/commands.ts";
import { handlePing, handleWhoAmICommand } from "./util.ts";
import { USER_SERVICE } from "../db/init.ts";
import { handleDiceCommand } from "./games.ts";
import { handleMinecraftCommand } from "./minecraft.ts";

export function handleApplicationCommands(
  data: APIUserApplicationCommandInteractionData,
  user?: APIUser,
  member?: APIGuildMember,
): Promise<{ status: number; body: Record<string, unknown> }> {
  const { name } = data;

  const commandUser = member?.user ?? user;

  if (commandUser) {
    USER_SERVICE.upsertUser(commandUser);
  }

  switch (name) {
    case Commands.Ping:
      return Promise.resolve(handlePing());

    case Commands.Dice:
      return Promise.resolve(handleDiceCommand(data));

    case Commands.Minecraft:
      return handleMinecraftCommand(data);

    case Commands.WhoAmI:
      return Promise.resolve(handleWhoAmICommand());

    default:
      return Promise.resolve({
        status: 400,
        body: { error: "unknown command" },
      });
  }
}

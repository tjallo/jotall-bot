import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  InteractionResponseType,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import { Commands } from "../consts/commands.ts";

enum DiceOptions {
  Sides = "sides",
  Count = "count",
}

export const DICE_COMMAND: RESTPostAPIApplicationCommandsJSONBody = {
  name: Commands.Dice,
  description: "Roll dice (default 1d6)",
  options: [
    {
      name: DiceOptions.Sides,
      type: ApplicationCommandOptionType.Integer,
      description: "Number of sides on each die (default 6)",
      required: false,
    },
    {
      name: DiceOptions.Count,
      type: ApplicationCommandOptionType.Integer,
      description: "Number of dice to roll (default 1)",
      required: false,
    },
  ],
  integration_types: [
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ],
  contexts: [
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ],
};

export function handleDiceCommand(
  data: {
    id: string;
    name: string;
    options?: Array<
      { name: string; type: ApplicationCommandOptionType; value: unknown }
    >;
    type: ApplicationCommandType;
  },
) {
  function getNumberOption(name: string, defaultValue: number): number {
    const option = data.options?.find((o) => o.name === name);
    if (!option) return defaultValue;
    if (typeof option.value === "number") return option.value;
    if (typeof option.value === "string") {
      const parsed = parseInt(option.value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  }

  let sides = getNumberOption(DiceOptions.Sides, 6);
  let count = getNumberOption(DiceOptions.Count, 1);

  if (sides < 2) sides = 6;
  if (sides > 1000) sides = 1000;

  if (count < 1) count = 1;
  if (count > 100) count = 100;

  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }

  const total = rolls.reduce((a, b) => a + b, 0);
  const rollsString = rolls.join(", ");

  const content = count <= 1
    ? `🎲 You rolled a d${sides} and got **${rolls[0]}**!`
    : `🎲 You rolled ${count}d${sides}: [${rollsString}] (total: **${total}**)`;

  return {
    status: 200,
    body: {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content },
    },
  };
}

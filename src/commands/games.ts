// src/commands/games.ts

import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import { Commands } from "../consts/commands.ts";
import type { CommandResponse } from "./handler.ts";
import { formatDiceRoll } from "../helpers/bot_formatters.ts";

enum DiceOptions {
  Sides = "sides",
  Count = "count",
}

const DICE_LIMITS = {
  MIN_SIDES: 2,
  MAX_SIDES: 1000,
  MIN_COUNT: 1,
  MAX_COUNT: 100,
  DEFAULT_SIDES: 6,
  DEFAULT_COUNT: 1,
} as const;

export const DICE_COMMAND: RESTPostAPIApplicationCommandsJSONBody = {
  name: Commands.Dice,
  description: "Roll dice (default 1d6)",
  options: [
    {
      name: DiceOptions.Sides,
      type: ApplicationCommandOptionType.Integer,
      description:
        `Number of sides (${DICE_LIMITS.MIN_SIDES}-${DICE_LIMITS.MAX_SIDES}, default ${DICE_LIMITS.DEFAULT_SIDES})`,
      required: false,
      min_value: DICE_LIMITS.MIN_SIDES,
      max_value: DICE_LIMITS.MAX_SIDES,
    },
    {
      name: DiceOptions.Count,
      type: ApplicationCommandOptionType.Integer,
      description:
        `Number of dice (${DICE_LIMITS.MIN_COUNT}-${DICE_LIMITS.MAX_COUNT}, default ${DICE_LIMITS.DEFAULT_COUNT})`,
      required: false,
      min_value: DICE_LIMITS.MIN_COUNT,
      max_value: DICE_LIMITS.MAX_COUNT,
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

export function handleDiceCommand(data: {
  id: string;
  name: string;
  options?: Array<{
    name: string;
    type: ApplicationCommandOptionType;
    value: unknown;
  }>;
  type: ApplicationCommandType;
}): CommandResponse {
  const sides = getNumberOption(
    data.options,
    DiceOptions.Sides,
    DICE_LIMITS.DEFAULT_SIDES,
  );
  const count = getNumberOption(
    data.options,
    DiceOptions.Count,
    DICE_LIMITS.DEFAULT_COUNT,
  );

  const clampedSides = clamp(
    sides,
    DICE_LIMITS.MIN_SIDES,
    DICE_LIMITS.MAX_SIDES,
  );
  const clampedCount = clamp(
    count,
    DICE_LIMITS.MIN_COUNT,
    DICE_LIMITS.MAX_COUNT,
  );

  const rolls = Array.from(
    { length: clampedCount },
    () => Math.floor(Math.random() * clampedSides) + 1,
  );
  const total = rolls.reduce((sum, roll) => sum + roll, 0);

  return {
    content: formatDiceRoll({
      sides: clampedSides,
      count: clampedCount,
      rolls,
      total,
    }),
  };
}

function getNumberOption(
  options: Array<{ name: string; value: unknown }> | undefined,
  name: string,
  defaultValue: number,
): number {
  const option = options?.find((o) => o.name === name);
  if (!option) return defaultValue;

  if (typeof option.value === "number") return option.value;
  if (typeof option.value === "string") {
    const parsed = parseInt(option.value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  return defaultValue;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

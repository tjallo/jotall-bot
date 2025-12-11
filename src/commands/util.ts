import {
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";

import { Commands } from "../consts/commands.ts";
import { CommandResponse } from "./handler.ts";
import { formatWhoAmI } from "../helpers/bot_formatters.ts";

export const PING_COMMAND: RESTPostAPIApplicationCommandsJSONBody = {
  name: Commands.Ping,
  description: "Replies with Pong",
  type: ApplicationCommandType.ChatInput,
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

export function handlePing(): CommandResponse {
  return { content: "Pong! 🏓" };
}

export const WHOAMI_COMMAND: RESTPostAPIApplicationCommandsJSONBody = {
  name: Commands.WhoAmI,
  description: "Explains what this bot is, and what it does",
  type: ApplicationCommandType.ChatInput,
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

export function handleWhoAmICommand(): CommandResponse {
  return { content: formatWhoAmI() };
}

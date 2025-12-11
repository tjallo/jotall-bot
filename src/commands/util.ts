import {
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";

import { Commands } from "../consts/commands.ts";
import { CommandResponse } from "./handler.ts";

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
  const content = `**Contribute & Source**
Check the code, report issues or contribute on GitHub: https://github.com/tjallo/jotall-bot

Thanks for using Jotall — drop a feature request or bug report on the repo!`;
  return { content };
}

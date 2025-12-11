import {
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  InteractionResponseType,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";

import { Commands } from "../consts/commands.ts";
import {
  InteractionResponseFlags,
  MessageComponentTypes,
} from "discord-interactions";

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

export function handlePing() {
  return {
    status: 200,
    body: {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        flags: InteractionResponseFlags.IS_COMPONENTS_V2,
        components: [
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `pong`,
          },
        ],
      },
    },
  };
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

export function handleWhoAmICommand() {
  const content = `**Contribute & Source**
Check the code, report issues or contribute on GitHub: https://github.com/tjallo/jotall-bot

Thanks for using Jotall — drop a feature request or bug report on the repo!`;

  return {
    status: 200,
    body: {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        flags: InteractionResponseFlags.IS_COMPONENTS_V2,
        components: [
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content,
          },
        ],
      },
    },
  };
}

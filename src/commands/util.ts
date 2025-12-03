import {
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";

import {
  InteractionResponseFlags,
  InteractionResponseType,
  MessageComponentTypes,
} from "discord-interactions";

import { Commands } from "../consts/commands.ts";

export const PING_COMMAND: RESTPostAPIApplicationCommandsJSONBody = {
  name: Commands.Ping,
  description: "Replies with Pong!",
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
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `pong!`,
        },
      ],
    },
  };
}

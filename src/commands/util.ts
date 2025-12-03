import {
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";

export const PING_COMMAND: RESTPostAPIApplicationCommandsJSONBody = {
  name: "ping",
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

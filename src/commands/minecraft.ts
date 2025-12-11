import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  InteractionResponseType,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";

import { Commands } from "../consts/commands.ts";
import { getMinecraftWS } from "../helpers/mc_server_mgmt_protocol_ws.ts";
import { Log } from "../helpers/log.ts";

enum SubCommands {
  ListOnlinePlayers = "list-online-players",
  AllowList = "get-allow-list",
}

const mappedSubCommands = [
  {
    name: SubCommands.ListOnlinePlayers,
    description: "List currently online players",
  },
  {
    name: SubCommands.AllowList,
    description: "Get players that are currently on the allow list",
  },
];

export const MINECRAFT_COMMAND: RESTPostAPIApplicationCommandsJSONBody = {
  name: Commands.Minecraft,
  description: "Minecraft helper commands",
  options: mappedSubCommands.map((sc) => ({
    ...sc,
    type: ApplicationCommandOptionType.Subcommand,
    options: [],
  })),
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

export async function handleMinecraftCommand(data: {
  id: string;
  name: string;
  options?: Array<
    { name: string; type: ApplicationCommandOptionType; value: unknown }
  >;
  type: ApplicationCommandType;
}) {
  const ws = getMinecraftWS();

  let content = "Unknown command.";
  const command = data.options?.at(0)?.name;
  switch (command) {
    case SubCommands.ListOnlinePlayers: {
      const players = await ws.getOnlinePlayers();
      content = players.length
        ? `**Online players (${players.length}):**\n• ${
          players.map((p) => p.name).join("\n• ")
        }`
        : "No players online right now.";
      break;
    }

    case SubCommands.AllowList: {
      const allowList = await ws.getAllowList();
      content = allowList.length
        ? `**Players on allow list (${allowList.length}):**\n• ${
          allowList.map((p) => p.name).join("\n• ")
        }`
        : "No players online right now.";
      break;
    }

    default:
      Log.error(`Unknown command found: ${command}`);
  }

  return {
    status: 200,
    body: {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content },
    },
  };
}

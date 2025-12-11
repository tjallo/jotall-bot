import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";

import { Commands } from "../consts/commands.ts";
import { getMinecraftWS } from "../helpers/mc_server_mgmt_protocol_ws.ts";
import { Log } from "../helpers/log.ts";
import type { CommandResponse } from "./handler.ts";
import {
  formatAllowList,
  formatGameRules,
  formatOnlinePlayers,
  formatServerStatus,
} from "../helpers/minecraft_formatters.ts";

enum SubCommands {
  ListOnlinePlayers = "list-online-players",
  AllowList = "get-allow-list",
  GameRules = "get-game-rules",
  ServerStatus = "get-server-status",
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
  {
    name: SubCommands.GameRules,
    description: "Get gamerules for server",
  },
  {
    name: SubCommands.ServerStatus,
    description: "Get server status",
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
}): Promise<CommandResponse> {
  const ws = getMinecraftWS();
  const command = data.options?.at(0)?.name;

  switch (command) {
    case SubCommands.ListOnlinePlayers: {
      const players = await ws.getOnlinePlayers();
      return { content: formatOnlinePlayers(players) };
    }

    case SubCommands.AllowList: {
      const allowList = await ws.getAllowList();
      return { content: formatAllowList(allowList) };
    }

    case SubCommands.GameRules: {
      const gameRules = await ws.getGameRules();
      return { content: formatGameRules(gameRules) };
    }

    case SubCommands.ServerStatus: {
      const status = await ws.getServerStatus();
      return { content: formatServerStatus(status) };
    }

    default:
      Log.error(`Unknown command found: ${command}`);
      return { error: `Unknown subcommand: ${command}` };
  }
}

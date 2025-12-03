import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { PING_COMMAND } from "../commands/util.ts";
import { Log } from "./log.ts";
import { discordRequest } from "./discord_request.ts";

export async function registerCommands(appId: string, discordToken: string) {
  const COMMANDS_TO_REGISTER: Array<RESTPostAPIApplicationCommandsJSONBody> = [
    PING_COMMAND,
  ];

  const endpoint = `applications/${appId}/commands`;

  try {
    const res = await discordRequest(endpoint, discordToken, {
      method: "PUT",
      body: JSON.stringify(COMMANDS_TO_REGISTER),
    });

    Log.debug("Successfully registered commands", await res.json());
  } catch (error) {
    Log.error(error);
  }
}

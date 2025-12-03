import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { PING_COMMAND } from "../commands/util.ts";
import { Log } from "./log.ts";
import { encodeHex } from "@std/encoding";
import { discordRequest } from "./discord_request.ts";
import { APP_ID, COMMAND_HASH_FILE, DISCORD_TOKEN } from "../consts/config.ts";

async function commandsNeedToBeRegistered(
  commands: Array<RESTPostAPIApplicationCommandsJSONBody>,
): Promise<boolean> {
  const messageBuffer = new TextEncoder().encode(JSON.stringify(commands));

  let prevHash: string | null = null;
  try {
    const decoder = new TextDecoder("utf-8");
    const contents = Deno.readFileSync(COMMAND_HASH_FILE);
    prevHash = decoder.decode(contents);
  } catch (_) {
    prevHash = null;
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);
  const hash = encodeHex(hashBuffer);

  if (hash === prevHash) {
    return false;
  }

  Deno.writeFileSync(COMMAND_HASH_FILE, new TextEncoder().encode(hash));

  return true;
}

export async function registerCommands() {
  const COMMANDS_TO_REGISTER: Array<RESTPostAPIApplicationCommandsJSONBody> = [
    PING_COMMAND,
  ];

  const needsToBeRegistered = await commandsNeedToBeRegistered(
    COMMANDS_TO_REGISTER,
  );
  if (!needsToBeRegistered) {
    Log.debug("Not neccesairy to update commands, they haven't changed");
    return;
  }

  const endpoint = `applications/${APP_ID}/commands`;

  try {
    const res = await discordRequest(endpoint, DISCORD_TOKEN, {
      method: "PUT",
      body: JSON.stringify(COMMANDS_TO_REGISTER),
    });

    Log.debug("Successfully registered commands", await res.json());
  } catch (error) {
    Log.error(error);
  }
}

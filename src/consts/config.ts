import * as path from "@std/path";

function getEnvVar(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`${name} not found in the environment`);
  }
  return value;
}

export const APP_ID = getEnvVar("APP_ID");
export const DISCORD_TOKEN = getEnvVar("DISCORD_TOKEN");
export const PUBLIC_KEY = getEnvVar("PUBLIC_KEY");

export const TMP_DIR = path.join(Deno.cwd(), "tmp");
export const COMMAND_HASH_FILE = path.join(TMP_DIR, "command_hash.txt");

export const LOG_DIR = path.join(Deno.cwd(), "log");

export const PORT = 3000;

const text = Deno.readTextFileSync("deno.json");
const config = JSON.parse(text);
export const JOTALL_VERSION = config.version;

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

export const TMP_FOLDER = path.join(Deno.cwd(), "tmp");
export const COMMAND_HASH_FILE = path.join(TMP_FOLDER, "command_hash.txt");

export const PORT = 3000;

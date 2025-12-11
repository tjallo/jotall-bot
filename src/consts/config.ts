import * as path from "@std/path";

export const Config = {
  APP_ID: Deno.env.get("APP_ID")!,
  DISCORD_TOKEN: Deno.env.get("DISCORD_TOKEN")!,
  PUBLIC_KEY: Deno.env.get("PUBLIC_KEY")!,

  MINECRAFT_SERVER_SECRET: Deno.env.get("MINECRAFT_SERVER_SECRET")!,
  MINECRAFT_SERVER_IP: Deno.env.get("MINECRAFT_SERVER_IP")!,
  MINECRAFT_MGMT_SERVER_PORT: Deno.env.get("MINECRAFT_MGMT_SERVER_PORT")!,

  TMP_DIR: path.join(Deno.cwd(), "tmp"),
  COMMAND_HASH_FILE: path.join(Deno.cwd(), "tmp", "command_hash.txt"),
  LOG_DIR: path.join(Deno.cwd(), "log"),
  DATA_DIR: path.join(Deno.cwd(), "data"),

  PORT: 3000,
  JOTALL_VERSION: JSON.parse(Deno.readTextFileSync("deno.json")).version,
} as const;

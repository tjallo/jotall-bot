import { registerCommands } from "./src/helpers/register.ts";

async function boot() {
  const APP_ID = Deno.env.get("APP_ID");
  if (!APP_ID) {
    throw new Error("APP_ID not found in the .env file");
  }

  const DISCORD_TOKEN = Deno.env.get("DISCORD_TOKEN");
  if (!DISCORD_TOKEN) {
    throw new Error("DISCORD_TOKEN not found in the .env file");
  }

  const PUBLIC_KEY = Deno.env.get("PUBLIC_KEY");
  if (!PUBLIC_KEY) {
    throw new Error("PUBLIC_KEY not found in the .env file");
  }

  await registerCommands(APP_ID, DISCORD_TOKEN);
}

async function main() {
  await boot();
}

if (import.meta.main) {
  await main();
}

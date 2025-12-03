import { TMP_FOLDER } from "./src/consts/config.ts";
import { registerCommands } from "./src/helpers/register.ts";

async function main() {
  Deno.mkdirSync(TMP_FOLDER, { recursive: true });
  await registerCommands();
}

if (import.meta.main) {
  await main();
}

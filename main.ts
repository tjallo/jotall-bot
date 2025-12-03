import express from "express";
import { verifyKeyMiddleware } from "discord-interactions";
import { handleApplicationCommands } from "./src/commands/handler.ts";
import {
  JOTALL_VERSION,
  PORT,
  PUBLIC_KEY,
  TMP_DIR,
} from "./src/consts/config.ts";
import { Log } from "./src/helpers/log.ts";
import { registerCommands } from "./src/helpers/register.ts";
import {
  InteractionResponseType,
  InteractionType,
} from "discord-api-types/v10";

function server() {
  const app = express();

  app.get("/health", (_req, res) => {
    return res.status(200).json({
      "healthy": true,
      "Jotall Bot version": JOTALL_VERSION,
      "deno": Deno.version.deno,
      "typescript": Deno.version.typescript,
      "v8": Deno.version.v8,
    });
  });

  app.post(
    "/interactions",
    verifyKeyMiddleware(PUBLIC_KEY),
    function (req, res) {
      const { _id, type, data } = req.body;

      if (type === InteractionType.Ping) {
        return res.send({ type: InteractionResponseType.Pong });
      }

      if (type === InteractionType.ApplicationCommand) {
        const { status, body } = handleApplicationCommands(data);

        if (status !== 200) {
          Log.error(body);
          return res.status(status).json(body);
        }

        return res.send(body);
      }

      Log.error("unknown interaction type", type);
      return res.status(400).json({ error: "unknown interaction type" });
    },
  );

  app.use((_req, res) => {
    return res.status(401).json({ error: "unauthorized" });
  });

  return app;
}

async function boot(): Promise<void> {
  Deno.mkdirSync(TMP_DIR, { recursive: true });
  await registerCommands();
}

async function main(): Promise<void> {
  await boot();

  const app = server();
  app.listen(PORT, () => {
    console.log("Listening on port", PORT);
  });
}

if (import.meta.main) {
  await main();
}

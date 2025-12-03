import { handleApplicationCommands } from "./src/commands/handler.ts";
import { PORT, PUBLIC_KEY, TMP_FOLDER } from "./src/consts/config.ts";
import { Log } from "./src/helpers/log.ts";
import { registerCommands } from "./src/helpers/register.ts";
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";

import express from "express";

function server() {
  const app = express();

  app.post(
    "/interactions",
    verifyKeyMiddleware(PUBLIC_KEY),
    function (req, res) {
      const { _id, type, data } = req.body;

      if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
      }

      if (type === InteractionType.APPLICATION_COMMAND) {
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

  return app;
}

async function boot(): Promise<void> {
  Deno.mkdirSync(TMP_FOLDER, { recursive: true });
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

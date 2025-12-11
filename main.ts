import express from "express";
import { verifyKeyMiddleware } from "discord-interactions";
import { handleApplicationCommands } from "./src/commands/handler.ts";
import { Config } from "./src/consts/config.ts";
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
      "Jotall Bot version": Config.JOTALL_VERSION,
      "deno": Deno.version.deno,
      "typescript": Deno.version.typescript,
      "v8": Deno.version.v8,
    });
  });

  app.post(
    "/interactions",
    verifyKeyMiddleware(Config.PUBLIC_KEY),
    async function (req, res) {
      const interaction = req.body;

      if (interaction.type === InteractionType.Ping) {
        return res.send({ type: InteractionResponseType.Pong });
      }

      if (interaction.type === InteractionType.ApplicationCommand) {
        const { status, body } = await handleApplicationCommands(
          interaction.data,
          interaction.user,
          interaction.member,
        );

        if (status !== 200) {
          Log.error(body);
          return res.status(status).json(body);
        }

        return res.send(body);
      }

      Log.error("unknown interaction type", interaction.type);
      return res.status(400).json({ error: "unknown interaction type" });
    },
  );

  app.use((_req, res) => {
    return res.status(401).json({ error: "unauthorized" });
  });

  return app;
}

async function boot(): Promise<void> {
  Deno.mkdirSync(Config.TMP_DIR, { recursive: true });
  await registerCommands();
}

async function main(): Promise<void> {
  await boot();

  const app = server();
  app.listen(Config.PORT, () => {
    console.log("Listening on port", Config.PORT);
  });
}

if (import.meta.main) {
  await main();
}

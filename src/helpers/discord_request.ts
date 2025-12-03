import { JOTALL_VERSION } from "../consts/config.ts";
import { Log } from "./log.ts";

export async function discordRequest(
  endpoint: string,
  discordToken: string,
  options: RequestInit,
): Promise<Response> {
  const url = "https://discord.com/api/v10/" + endpoint;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${discordToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent":
        `Jotall Bot version: ${JOTALL_VERSION} - deno: ${Deno.version.deno}, typescript: ${Deno.version.typescript}, v8: ${Deno.version.v8}`,
    },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json();
    Log.error(res.status);

    throw new Error(JSON.stringify(data));
  }

  return res;
}

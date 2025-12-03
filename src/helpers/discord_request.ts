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
      "User-Agent": "Jotall Bot",
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

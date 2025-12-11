import { Config } from "../consts/config.ts";
import { JsonRpcResponse } from "../consts/json_rpc.ts";

import { Log } from "./log.ts";

class MinecraftServerManagementProtocolWS {
  private ws: WebSocket;

  constructor() {
    const wsUrl =
      `ws://${Config.MINECRAFT_SERVER_IP}:${Config.MINECRAFT_MGMT_SERVER_PORT}`;

    this.ws = new WebSocket(wsUrl, {
      headers: { "Authorization": `Bearer ${Config.MINECRAFT_SERVER_SECRET}` },
    });

    this.ws.onopen = (ev: Event) => {
      Log.info("mc-ws:open", { url: wsUrl, event: ev });
    };

    this.ws.onmessage = (ev: MessageEvent) => {
      let payload: JsonRpcResponse;
      try {
        payload = JSON.parse(ev.data) as JsonRpcResponse;
      } catch (error) {
        Log.error("Failed to parse payload: ", error);
        return;
      }

      Log.debug(payload);
    };

    this.ws.onclose = (ev: CloseEvent) => {
      Log.info("mc-ws:close", {
        code: ev.code,
        reason: ev.reason,
        wasClean: ev.wasClean,
      });
    };

    this.ws.onerror = (ev: Event | unknown) => {
      const err = (ev as any)?.error ?? ev;

      Log.error("mc-ws:error", { error: err });
    };
  }

  send(data: unknown) {
    this.ws.send(JSON.stringify(data));
  }
}

let wsInstance: MinecraftServerManagementProtocolWS | null = null;

export function getMinecraftWS() {
  if (!wsInstance) {
    wsInstance = new MinecraftServerManagementProtocolWS();
  }

  return wsInstance;
}

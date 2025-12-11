import { Config } from "../consts/config.ts";
import { JsonRpcRequest, JsonRpcResponse } from "../consts/json_rpc.ts";

import { Log } from "./log.ts";

class MinecraftServerManagementProtocolWS {
  private ws: WebSocket;
  private msgId = 0;

  private pending = new Map<number, (res: JsonRpcResponse) => void>();

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

      Log.debug("mc-ws:payload", payload);

      if (payload.id != null && this.pending.has(payload.id)) {
        const resolve = this.pending.get(payload.id)!;
        this.pending.delete(payload.id);
        resolve(payload);
      }
    };

    this.ws.onclose = (ev: CloseEvent) => {
      Log.info("mc-ws:close", {
        code: ev.code,
        reason: ev.reason,
        wasClean: ev.wasClean,
      });
    };

    this.ws.onerror = (ev: Event | unknown) => {
      const err = (ev as { error?: unknown }).error ?? ev;
      Log.error("mc-ws:error", { error: err });
    };
  }

  private waitForOpen(): Promise<void> {
    if (this.ws.readyState === WebSocket.OPEN) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const onOpen = () => {
        this.ws.removeEventListener("open", onOpen);
        resolve();
      };

      const onError = (err: unknown) => {
        this.ws.removeEventListener("error", onError);
        reject(err);
      };

      this.ws.addEventListener("open", onOpen);
      this.ws.addEventListener("error", onError);
    });
  }

  private async send(data: unknown) {
    await this.waitForOpen();
    this.ws.send(JSON.stringify(data));
  }

  private rpc<T = unknown>(method: string, params?: unknown): Promise<T> {
    const id = this.msgId++;

    const req: JsonRpcRequest = {
      jsonrpc: "2.0",
      method,
      id,
      params,
    };

    const promise = new Promise<T>((resolve, reject) => {
      this.pending.set(id, (response: JsonRpcResponse) => {
        if ("error" in response && response.error) {
          reject(response.error);
        } else {
          resolve(response.result as T);
        }
      });
    });

    this.send(req).catch((err) => {
      if (this.pending.has(id)) {
        const resolver = this.pending.get(id)!;
        this.pending.delete(id);

        resolver({ id, jsonrpc: "2.0", error: err } as JsonRpcResponse);
      }
    });

    return promise;
  }

  getOnlinePlayers(): Promise<Array<{ id: string; name: string }>> {
    return this.rpc<Array<{ id: string; name: string }>>("minecraft:players");
  }
}

let wsInstance: MinecraftServerManagementProtocolWS | null = null;

export function getMinecraftWS() {
  if (!wsInstance) {
    wsInstance = new MinecraftServerManagementProtocolWS();
  }

  return wsInstance;
}

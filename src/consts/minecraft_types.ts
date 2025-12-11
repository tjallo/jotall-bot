export type MinecraftPlayer = { name: string; id: string };

export type MinecraftVersion = { protocol: number; name: string };

export interface MinecraftTypedGameRule {
  type: "integer" | "boolean";
  value: string;
  key: string;
}

export interface MinecraftServerStatus {
  players: Array<MinecraftPlayer>;
  started: boolean;
  version: MinecraftVersion;
}

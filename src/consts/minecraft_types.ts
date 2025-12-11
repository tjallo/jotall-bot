export type MinecraftPlayer = { name: string; id: string };

export type MinecraftTypedGameRule = {
  type: "integer" | "boolean";
  value: string;
  key: string;
};

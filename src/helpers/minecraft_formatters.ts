import type {
  MinecraftPlayer,
  MinecraftServerStatus,
  MinecraftTypedGameRule,
} from "../consts/minecraft_types.ts";

export function formatServerStatus(status: MinecraftServerStatus): string {
  const statusEmoji = status.started ? "🟢" : "🔴";
  const playersEmoji = status.players.length > 0 ? "👥" : "👤";

  const playerSection = status.players.length
    ? `\`\`\`\n${status.players.map((p) => p.name).join(", ")}\n\`\`\``
    : "*No players online*";

  return [
    `${statusEmoji} **Server ${
      status.started ? "Online" : "Offline"
    }** • v${status.version.name}`,
    "",
    `${playersEmoji} **Players (${status.players.length}):**`,
    playerSection,
  ].join("\n");
}

export function formatOnlinePlayers(players: MinecraftPlayer[]): string {
  if (!players.length) {
    return "👤 *No players online right now*";
  }

  const playerList = players
    .map((p, i) => `${i + 1}. **${p.name}**`)
    .join("\n");

  return [
    `## 🎮 Online Players (${players.length})`,
    "",
    playerList,
  ].join("\n");
}

export function formatAllowList(players: MinecraftPlayer[]): string {
  if (!players.length) {
    return "📋 *Allow list is empty*";
  }

  const playerList = players
    .map((p) => `• ${p.name}`)
    .join("\n");

  return [
    `## 📋 Allow List (${players.length})`,
    "",
    playerList,
  ].join("\n");
}

export function formatGameRules(rules: MinecraftTypedGameRule[]): string {
  if (!rules.length) {
    return "⚙️ *No gamerules found*";
  }

  // Group rules by type
  const booleanRules = rules.filter((r) => r.type === "boolean");
  const integerRules = rules.filter((r) => r.type === "integer");

  const formatValue = (rule: MinecraftTypedGameRule): string => {
    if (rule.type === "boolean") {
      return rule.value === "true" ? "✅" : "❌";
    }
    return `\`${rule.value}\``;
  };

  const formatRuleList = (ruleList: MinecraftTypedGameRule[]): string =>
    ruleList
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((r) => `• **${r.key}:** ${formatValue(r)}`)
      .join("\n");

  const sections = [
    `## ⚙️ Game Rules (${rules.length})`,
  ];

  if (booleanRules.length) {
    sections.push(
      "",
      `### Toggle Rules (${booleanRules.length})`,
      formatRuleList(booleanRules),
    );
  }

  if (integerRules.length) {
    sections.push(
      "",
      `### Value Rules (${integerRules.length})`,
      formatRuleList(integerRules),
    );
  }

  return sections.join("\n");
}

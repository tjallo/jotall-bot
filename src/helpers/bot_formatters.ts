import { Config } from "../consts/config.ts";

export interface DiceRollResult {
  sides: number;
  count: number;
  rolls: number[];
  total: number;
}

export function formatWhoAmI(): string {
  const lines = [
    `## 🤖 Jotall Bot`,
    "",
    `> Your friendly Discord companion for Minecraft server management & more!`,
    "",
    "### 📊 Bot Info",
    `• **Version:** ${Config.JOTALL_VERSION ?? "Unknown"}`,
    `• **Runtime:** Deno ${Deno.version.deno}`,
    `• **TypeScript:** ${Deno.version.typescript}`,
    "",
    "### ✨ Features",
    "• 🎮 Minecraft server management",
    "• 🎲 Dice rolling",
    "• *...and more coming soon!*",
    "",
    "### 🔗 Links",
    "• [📦 GitHub Repository](https://github.com/tjallo/jotall-bot)",
    "• [🐛 Report a Bug](https://github.com/tjallo/jotall-bot/issues/new?template=bug_report.md)",
    "• [💡 Request a Feature](https://github.com/tjallo/jotall-bot/issues/new?template=feature_request.md)",
    "",
    "*Made with ❤️ by tjallo*",
  ];

  return lines.join("\n");
}

export function formatDiceRoll(result: DiceRollResult): string {
  const { sides, count, rolls, total } = result;
  const diceNotation = `${count}d${sides}`;

  // Single die roll
  if (count === 1) {
    const roll = rolls[0];
    const emoji = getDiceEmoji(roll, sides);
    return [
      `## 🎲 Dice Roll`,
      "",
      `**${diceNotation}** → ${emoji} **${roll}**`,
    ].join("\n");
  }

  // Multiple dice
  const avg = (total / count).toFixed(1);
  const min = Math.min(...rolls);
  const max = Math.max(...rolls);

  // Format rolls with highlighting for min/max
  const formattedRolls = rolls.map((r) => {
    if (r === sides) return `**${r}**`;
    if (r === 1) return `*${r}*`;
    return String(r);
  }).join(", ");

  const lines = [
    `## 🎲 Dice Roll`,
    "",
    `**${diceNotation}** → [ ${formattedRolls} ]`,
    "",
    "### 📈 Statistics",
    `• **Total:** ${total}`,
    `• **Average:** ${avg}`,
    `• **Lowest:** ${min}`,
    `• **Highest:** ${max}`,
  ];

  // Add special messages for interesting rolls
  const specialMessage = getSpecialMessage(rolls, sides);
  if (specialMessage) {
    lines.push("", specialMessage);
  }

  return lines.join("\n");
}

function getDiceEmoji(roll: number, sides: number): string {
  // Special emoji for d6 faces
  if (sides === 6) {
    const d6Emoji = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    return d6Emoji[roll] ?? "🎲";
  }

  // Critical success/fail indicators
  if (roll === sides) return "💥";
  if (roll === 1) return "💀";

  return "🎯";
}

function getSpecialMessage(rolls: number[], sides: number): string | null {
  const allSame = rolls.every((r) => r === rolls[0]);
  const allMax = rolls.every((r) => r === sides);
  const allMin = rolls.every((r) => r === 1);

  if (rolls.length > 1) {
    if (allMax) return "🔥 **JACKPOT!** All maximum rolls!";
    if (allMin) return "💀 **SNAKE EYES!** All ones... ouch!";
    if (allSame) return `✨ **MATCHING!** All ${rolls[0]}s!`;
  }

  // Critical rolls for d20
  if (sides === 20 && rolls.length === 1) {
    if (rolls[0] === 20) return "⚔️ **NATURAL 20!** Critical success!";
    if (rolls[0] === 1) return "💀 **NATURAL 1!** Critical failure!";
  }

  return null;
}

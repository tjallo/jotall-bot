// deno-lint-ignore-file no-explicit-any
import * as path from "@std/path";
import { Config } from "../consts/config.ts";

export class Log {
  private static logDir = Config.LOG_DIR;

  private static async ensureLogDir() {
    try {
      await Deno.stat(this.logDir);
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) {
        await Deno.mkdir(this.logDir, { recursive: true });
      } else {
        throw err;
      }
    }
  }

  private static getLogFilePath(): string {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    const filename = `${y}-${m}-${d}.log`;

    return path.join(this.logDir, filename);
  }

  private static formatMessage(level: string, data: any[]): string {
    const timestamp = new Date().toISOString();
    const message = data.map((
      d,
    ) => (typeof d === "string" ? d : JSON.stringify(d))).join(" ");

    return `[${timestamp}] [${level}] ${message}\n`;
  }

  private static async writeLog(level: string, data: any[]) {
    await this.ensureLogDir();

    const filePath = this.getLogFilePath();
    const message = this.formatMessage(level, data);

    try {
      await Deno.writeTextFile(filePath, message, { append: true });
    } catch (error) {
      console.error("Failed to write log file:", error);
    }
  }

  static async debug(...data: any[]) {
    console.debug(...data);
    await this.writeLog("DEBUG", data);
  }

  static async info(...data: any[]) {
    console.info(...data);
    await this.writeLog("INFO", data);
  }

  static async error(...data: any[]) {
    console.error(...data);
    await this.writeLog("ERROR", data);
  }
}

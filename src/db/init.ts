import { DatabaseSync } from "node:sqlite";
import * as path from "@std/path";
import { UserService } from "./schemas/user.ts";
import { Config } from "../consts/config.ts";

const DB_FILE = path.join(Config.DATA_DIR, "jotall.db");
Deno.mkdirSync(Config.DATA_DIR, { recursive: true });
const DB = new DatabaseSync(DB_FILE);

export const USER_SERVICE = new UserService(DB);

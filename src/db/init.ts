import { DatabaseSync } from "node:sqlite";
import { UserService } from "./schemas/user.ts";

const DB_FILE = "jotall.db";
const DB = new DatabaseSync(DB_FILE);

export const USER_SERVICE = new UserService(DB);

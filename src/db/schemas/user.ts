import { DatabaseSync } from "node:sqlite";

interface User {
  user_pk?: number;
  id: string;
  username: string;
  global_name?: string | null;
}

export class UserService {
  private db: DatabaseSync;

  private readonly userSchema = `
    CREATE TABLE IF NOT EXISTS users (
      user_pk INTEGER PRIMARY KEY AUTOINCREMENT,
      id TEXT UNIQUE NOT NULL,
      username TEXT NOT NULL,
      global_name TEXT
    )
  `;

  constructor(db: DatabaseSync) {
    this.db = db;
    this.db.exec(this.userSchema);
  }

  upsertUser(user: User): number | bigint {
    const stmt = this.db.prepare(`
        INSERT INTO users (id, username, global_name)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            username = excluded.username,
            global_name = excluded.global_name
    `);

    const result = stmt.run(user.id, user.username, user.global_name ?? null);

    return result.lastInsertRowid!;
  }

  getUserByPk(user_pk: number): User | null {
    const stmt = this.db.prepare(`
      SELECT user_pk, id, username, global_name
      FROM users WHERE user_pk = ?
    `);

    const row = stmt.get(user_pk);
    if (!row) return null;

    return {
      user_pk: row.user_pk as number,
      id: row.id as string,
      username: row.username as string,
      global_name: row.global_name as string | null,
    };
  }

  updateUser(user: User): boolean {
    if (!user.user_pk) throw new Error("user_pk is required for update");

    const stmt = this.db.prepare(`
      UPDATE users SET
        id = ?, username = ?, global_name = ?
      WHERE user_pk = ?
    `);

    const result = stmt.run(
      user.id,
      user.username,
      user.global_name ?? null,
      user.user_pk,
    );

    return result.changes > 0;
  }

  deleteUser(user_pk: number): boolean {
    const stmt = this.db.prepare(`DELETE FROM users WHERE user_pk = ?`);
    const result = stmt.run(user_pk);
    return result.changes > 0;
  }

  getAllUsers(): User[] {
    const stmt = this.db.prepare(`
    SELECT user_pk, id, username, global_name FROM users
  `);

    const users: User[] = [];
    for (const row of stmt.iterate()) {
      users.push({
        user_pk: row.user_pk as number,
        id: row.id as string,
        username: row.username as string,
        global_name: row.global_name as string | null,
      });
    }
    return users;
  }
}

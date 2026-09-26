import * as SQLite from "expo-sqlite";
import { hashPassword } from "@/utils/security";
import { User, UserRole } from "@/types";
import { DB_SCHEMA_SQL } from "@/db/sql/schema.sql";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

const createTables = async (db: SQLite.SQLiteDatabase) =>
  db.execAsync(DB_SCHEMA_SQL);

const migrateAccountsPhotos = async (db: SQLite.SQLiteDatabase) => {
  const columns = await db.getAllAsync<{ name: string }>(
    "PRAGMA table_info(accountsphotos)",
  );
  const hasImagePath = columns.some(
    (column) => column.name.toLowerCase() === "imagepath",
  );
  if (!hasImagePath) {
    await db.runAsync("ALTER TABLE accountsphotos ADD COLUMN imagepath TEXT");
  }

  const addColumnIfMissing = async (name: string, definition: string) => {
    const currentColumns = await db.getAllAsync<{ name: string }>(
      "PRAGMA table_info(accountsphotos)",
    );
    if (!currentColumns.some((column) => column.name.toLowerCase() === name)) {
      await db.runAsync(
        `ALTER TABLE accountsphotos ADD COLUMN ${name} ${definition}`,
      );
    }
  };

  await addColumnIfMissing("created_at", "TIMESTAMP");
  await addColumnIfMissing("updated_at", "TIMESTAMP");
  await addColumnIfMissing("deleted_at", "TIMESTAMP");
  await addColumnIfMissing("sync_version", "INTEGER DEFAULT 1");
};

export const getDB = async () => {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync("npa_local.db");
  }
  return databasePromise;
};

export const initializeDatabase = async () => {
  const db = await getDB();
  await createTables(db);
  await migrateAccountsPhotos(db);
};

export const authenticateUser = async (
  loginId: string,
  passwordHash: string,
): Promise<User | null> => {
  const db = await getDB();
  const user = await db.getFirstAsync<{
    UserID: number;
    UserRole: string;
    UserName: string;
    Mobile: string;
    EMail: string;
    LoginID: string;
    Password: string;
  }>(
    `SELECT
      userid AS UserID,
      userrole AS UserRole,
      username AS UserName,
      mobile AS Mobile,
      email AS EMail,
      loginid AS LoginID,
      "Password" AS Password
     FROM users
     WHERE loginid = ? AND "Password" = ?
     LIMIT 1`,
    [loginId, passwordHash],
  );
  if (!user) return null;
  return {
    id: user.UserID,
    role: (user.UserRole?.toUpperCase() as UserRole) || "SURVEY",
    name: user.UserName,
    mobile: user.Mobile ?? "",
    email: user.EMail ?? "",
    login_id: user.LoginID,
  };
};

export const createUser = async (payload: {
  role: UserRole;
  name: string;
  mobile: string;
  email: string;
  loginId: string;
  password: string;
}) => {
  const db = await getDB();
  await db.runAsync(
    'INSERT INTO users (username, mobile, email, loginid, "Password", userrole, userlocation, clientid) VALUES (?, ?, ?, ?, ?, ?, 0, 0)',
    [
      payload.name,
      payload.mobile,
      payload.email,
      payload.loginId,
      hashPassword(payload.password),
      payload.role,
    ],
  );
};

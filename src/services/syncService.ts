import { getDB } from "@/db/database";
import { ServerConfig } from "@/types";
import { apiService } from "@/services/apiService";
import { toDbCredentials } from "@/context/AuthContext";
import type { SQLiteBindValue } from "expo-sqlite";

const nowIso = () => new Date().toISOString();
const REMOTE_DOWNLOAD_LIMIT = 500;
const UPLOAD_BATCH_SIZE = 100;

const ACCOUNT_COLUMNS = [
  "acid",
  "clientid",
  "ledgerid",
  "zid",
  "wardno",
  "propertyno",
  "partno",
  "citysurveyno",
  "plotno",
  "o_onlineno",
  "o_zid",
  "o_wardno",
  "o_propertyno",
  "o_partno",
  "o_citysurveyno",
  "o_plotno",
  "o_usage",
  "o_taxablevalue",
  "o_anualrentalvalue",
  "aadhar_no",
  "CTID",
  "puid",
  "o_totaltax",
  "owner_name",
  "holder_name",
  "wife_name",
  "buildingname",
  "buildingno",
  "address",
  "mobileno",
  "exchange",
  "hastoilet",
  "toiletseats1",
  "toiletseats2",
  "haswaterconnection",
  "totalwaterconnections",
  "hassolarelectricity",
  "hasrainwaterharvesting",
  "hastree",
  "boundry_east",
  "boundry_west",
  "boundry_north",
  "boundry_south",
  "lengthoneast",
  "lengthonwest",
  "lengthonnorth",
  "lengthonsouth",
  "avg_length",
  "avg_breadth",
  "area",
  "opa",
  "gharkul",
  "hasgharkul",
  "treenos",
  "hastenant",
  "hasbore",
  "haswell",
  "tenantname",
  "photopath",
  "mappath",
  "Length",
  "breadth",
  "asmcomplete",
  "oldbuiltuparea",
  "remark1",
  "remark2",
  "hastower",
  "manualratablevalue",
  "manualtax",
  "remarks3",
  "numberingremarks",
  "numberingdone",
  "surveydone",
  "updated_at",
  "created_at",
  "deleted_at",
] as const;

interface DownloadOptions {
  onStatus?: (message: string) => void;
}

interface UploadOptions {
  onStatus?: (message: string) => void;
}

const UPLOAD_TABLES = [
  { remote: "accounts", local: "accounts", key: "acid" },
  { remote: "assessment", local: "assessment", key: "asid" },
  { remote: "taxpayments", local: "taxpayments", key: "pyid" },
] as const;

const addLog = async (status: "SUCCESS" | "ERROR", message: string) => {
  const db = await getDB();
  await db.runAsync(
    "INSERT INTO usagelog (logtype, description, logdate) VALUES (?, ?, ?)",
    [status, message, nowIso()],
  );
};

export const getSyncLogs = async () => {
  const db = await getDB();
  return db.getAllAsync<{
    id: number;
    status: string;
    message: string;
    created_at: string;
  }>(
    `SELECT logid as id, logtype as status, description as message, logdate as created_at
     FROM usagelog ORDER BY logid DESC LIMIT 20`,
  );
};

const quoteIdentifier = (value: string) => `"${value.replace(/"/g, '""')}"`;

const markSynced = async (
  tableName: string,
  recordKey: string,
  version: number,
) => {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO sync_state (table_name, record_key, synced_version, synced_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(table_name, record_key) DO UPDATE SET
       synced_version = excluded.synced_version,
       synced_at = excluded.synced_at`,
    [tableName, recordKey, version, nowIso()],
  );
};

const getRowValue = (row: Record<string, unknown>, name: string) => {
  const key = Object.keys(row).find(
    (candidate) => candidate.toLowerCase() === name,
  );
  return key ? row[key] : undefined;
};

const getDirtyRows = async (table: (typeof UPLOAD_TABLES)[number]) => {
  const db = await getDB();
  return db.getAllAsync<Record<string, unknown>>(
    `SELECT source.*, COALESCE(source.sync_version, 1) AS __sync_version,
       CAST(source.${quoteIdentifier(table.key)} AS TEXT) AS __record_key
     FROM ${quoteIdentifier(table.local)} AS source
     LEFT JOIN sync_state AS state
       ON state.table_name = ?
       AND state.record_key = CAST(source.${quoteIdentifier(table.key)} AS TEXT)
     WHERE COALESCE(source.sync_version, 1) > COALESCE(state.synced_version, 0)
     ORDER BY source.${quoteIdentifier(table.key)}`,
    [table.remote],
  );
};

const toUploadRow = (row: Record<string, unknown>) => {
  const output = { ...row };
  delete output.__sync_version;
  delete output.__record_key;
  delete output.sync_version;
  return output;
};

const toSQLiteValue = (value: unknown): SQLiteBindValue => {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value instanceof Uint8Array
  ) {
    return value;
  }
  if (value === undefined) return null;
  return JSON.stringify(value);
};

export const saveAccount = async (row: Record<string, unknown>) => {
  const db = await getDB();
  const incomingColumnMap = new Map(
    Object.keys(row).map((key) => [key.toLowerCase(), key]),
  );
  const placeholders = ACCOUNT_COLUMNS.map(() => "?").join(", ");
  const columnSql = ACCOUNT_COLUMNS.map(quoteIdentifier).join(", ");
  const values = ACCOUNT_COLUMNS.map((column) => {
    const rowKey = incomingColumnMap.get(column.toLowerCase());
    const value = rowKey ? row[rowKey] : null;
    return toSQLiteValue(value);
  });

  await db.runAsync(
    `INSERT OR REPLACE INTO accounts (${columnSql}) VALUES (${placeholders})`,
    values,
  );
};

export const downloadFromServer = async (
  config: ServerConfig,
  options: DownloadOptions = {},
) => {
  try {
    if (!config.serverUrl) {
      throw new Error("Server URL not configured.");
    }

    options.onStatus?.("Preparing account download...");
    const db = await getDB();
    const latestAccount = await db.getFirstAsync<{ last_id: number }>(
      "SELECT COALESCE(MAX(acid), 0) as last_id FROM accounts",
    );
    let downloaded = 0;

    options.onStatus?.(
      `Requesting accounts after ACID ${latestAccount?.last_id ?? 0}...`,
    );
    await apiService.syncDownload(
      {
        ...toDbCredentials(config),
        table_name: "accounts",
        last_sync_time: "1900-01-01T00:00:00.000Z",
        last_id: latestAccount?.last_id ?? 0,
        limit: REMOTE_DOWNLOAD_LIMIT,
      },
      {
        onRow: async (row) => {
          await saveAccount(row);
          const acid = getRowValue(row, "acid");
          if (acid !== undefined && acid !== null) {
            await markSynced(
              "accounts",
              String(acid),
              Number(getRowValue(row, "sync_version") ?? 1),
            );
          }
          downloaded += 1;
          if (downloaded === 1 || downloaded % 25 === 0) {
            options.onStatus?.(`Saved ${downloaded} account records...`);
          }
        },
      },
    );

    options.onStatus?.(
      `Download complete. ${downloaded} account records saved.`,
    );
    await addLog(
      "SUCCESS",
      `Download completed. ${downloaded} account records saved.`,
    );
    return { accounts: downloaded };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown sync download error";
    await addLog("ERROR", message);
    throw error;
  }
};

export const uploadToServer = async (
  config: ServerConfig,
  options: UploadOptions = {},
) => {
  try {
    if (!config.serverUrl) {
      throw new Error("Server URL not configured.");
    }

    let uploaded = 0;
    for (const table of UPLOAD_TABLES) {
      const rows = await getDirtyRows(table);
      options.onStatus?.(`${table.remote}: ${rows.length} pending records...`);

      for (let offset = 0; offset < rows.length; offset += UPLOAD_BATCH_SIZE) {
        const batch = rows.slice(offset, offset + UPLOAD_BATCH_SIZE);
        const ndjson = `${batch.map((row) => JSON.stringify(toUploadRow(row))).join("\n")}\n`;
        await apiService.syncLocalToRemoteStream({
          ...toDbCredentials(config),
          table_name: table.remote,
          ndjson,
        });

        for (const row of batch) {
          await markSynced(
            table.remote,
            String(row.__record_key),
            Number(row.__sync_version),
          );
        }
        uploaded += batch.length;
        options.onStatus?.(`Uploaded ${uploaded} records...`);
      }
    }

    await addLog("SUCCESS", `Upload completed. ${uploaded} records streamed.`);
    return { accounts: uploaded };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown sync upload error";
    await addLog("ERROR", message);
    throw error;
  }
};

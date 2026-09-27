import { getDB } from "@/db/database";
import { ServerConfig } from "@/types";
import { apiService } from "@/services/apiService";
import { toDbCredentials } from "@/context/AuthContext";
import type { SQLiteBindValue } from "expo-sqlite";
import * as FileSystem from "expo-file-system/legacy";

const nowIso = () => new Date().toISOString();
const REMOTE_DOWNLOAD_LIMIT = 500;
const UPLOAD_BATCH_SIZE = 100;
const PHOTO_BATCH_SIZE = 5000;
const MAX_PHOTO_SIZE_BYTES = 25 * 1024 * 1024;
const ALLOWED_PHOTO_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
]);

const ACCOUNT_COLUMNS = [
  "ACID",
  "ClientID",
  "LedgerID",
  "ZID",
  "WardNo",
  "PropertyNo",
  "PartNo",
  "CitySurveyNo",
  "PlotNo",
  "O_OnlineNo",
  "O_ZID",
  "O_WardNo",
  "O_PropertyNo",
  "O_PartNo",
  "O_CitySurveyNo",
  "O_PlotNo",
  "Aadhar_No",
  "CTID",
  "PUID",
  "O_TotalTax",
  "Owner_Name",
  "Holder_Name",
  "Wife_Name",
  "BuildingName",
  "BuildingNo",
  "Address",
  "MobileNo",
  "Exchange",
  "HasToilet",
  "ToiletSeats1",
  "ToiletSeats2",
  "HasWaterConnection",
  "TotalWaterConnections",
  "HasSolarElectricity",
  "HasRainWaterHarvesting",
  "HasTree",
  "Boundry_East",
  "Boundry_West",
  "Boundry_North",
  "Boundry_South",
  "LengthOnEast",
  "LengthOnWest",
  "LengthOnNorth",
  "LengthOnSouth",
  "Avg_Length",
  "Avg_Breadth",
  "Area",
  "OPA",
  "Gharkul",
  "HasGharkul",
  "TreeNos",
  "HasTenant",
  "HasBore",
  "HasWell",
  "TenantName",
  "PhotoPath",
  "MapPath",
  "Length",
  "Breadth",
  "AsmComplete",
  "oldbuiltuparea",
  "Remark1",
  "Remark2",
  "HasTower",
  "ManualRatableValue",
  "ManualTax",
  "Remarks3",
  "PropertyKNRNo",
  "WaterKNRNo",
  "numberingremarks",
  "numberingdone",
  "surveydone",
  "updated_at",
  "created_at",
  "deleted_at",
  "sync_version",
] as const;

interface DownloadOptions {
  onStatus?: (message: string) => void;
}

interface UploadOptions {
  onStatus?: (message: string) => void;
}

const UPLOAD_TABLES = [
  { remote: "Accounts", local: "Accounts", key: "ACID" },
  { remote: "AccountsPhotos", local: "AccountsPhotos", key: "ImageId" },
  { remote: "Assessment", local: "Assessment", key: "ASID" },
  { remote: "TaxPayments", local: "TaxPayments", key: "PYID" },
] as const;

const addLog = async (status: "SUCCESS" | "ERROR", message: string) => {
  const db = await getDB();
  await db.runAsync(
    "INSERT INTO UsageLog (LogType, Description, LogDate) VALUES (?, ?, ?)",
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
    `SELECT LogID as id, LogType as status, Description as message, LogDate as created_at
     FROM UsageLog ORDER BY LogID DESC LIMIT 20`,
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

interface PendingPhoto {
  ImageId: number;
  FileName: string | null;
  MimeType: string | null;
  ImagePath: string;
  sync_version: number;
}

const getPendingPhotos = async (): Promise<PendingPhoto[]> => {
  const db = await getDB();
  return db.getAllAsync<PendingPhoto>(
    `SELECT source.ImageId AS ImageId,
       source.FileName AS FileName,
       source.MimeType AS MimeType,
       source.ImagePath AS ImagePath,
       COALESCE(source.sync_version, 1) AS sync_version
     FROM AccountsPhotos AS source
     LEFT JOIN sync_state AS state
       ON state.table_name = 'AccountsPhotosFiles'
       AND state.record_key = CAST(source.ImageId AS TEXT)
     WHERE COALESCE(source.sync_version, 1) > COALESCE(state.synced_version, 0)
     ORDER BY source.ImageId`,
  );
};

const preparePhoto = async (photo: PendingPhoto) => {
  const filename =
    photo.FileName?.trim() ||
    decodeURIComponent(
      photo.ImagePath.split(/[?#]/)[0].split(/[\\/]/).pop() ?? "",
    );
  const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_PHOTO_EXTENSIONS.has(extension)) {
    throw new Error(
      `Unsupported photo extension for ${filename || photo.ImageId}.`,
    );
  }

  const info = await FileSystem.getInfoAsync(photo.ImagePath);
  if (!info.exists || !("size" in info)) {
    throw new Error(`Photo file is missing: ${filename}.`);
  }
  if (info.size <= 0) throw new Error(`Photo file is empty: ${filename}.`);
  if (info.size > MAX_PHOTO_SIZE_BYTES) {
    throw new Error(`${filename} exceeds the 25 MiB photo limit.`);
  }

  const inferredMimeType: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  const storedMimeType = photo.MimeType?.trim() ?? "";
  const mimeType =
    /^image\//i.test(storedMimeType) ||
    storedMimeType.toLowerCase() === "application/octet-stream"
      ? storedMimeType
      : inferredMimeType[extension];

  return { ...photo, filename, mimeType };
};

const uploadPendingPhotos = async (onStatus?: (message: string) => void) => {
  const photos = await Promise.all(
    (await getPendingPhotos()).map(preparePhoto),
  );
  let uploadedPhotos = 0;

  for (let offset = 0; offset < photos.length; offset += PHOTO_BATCH_SIZE) {
    const batchPhotos = photos.slice(offset, offset + PHOTO_BATCH_SIZE);
    const batch = await apiService.createPhotoBatch(batchPhotos.length);

    for (let index = 0; index < batchPhotos.length; index += 1) {
      const photo = batchPhotos[index];
      onStatus?.(
        `Uploading photo ${offset + index + 1} of ${photos.length}...`,
      );
      await apiService.uploadPhoto(
        batch.batch_id,
        photo.ImagePath,
        photo.filename,
        photo.mimeType,
      );
    }

    const batchStatus = await apiService.getPhotoBatchStatus(batch.batch_id);
    if (
      batchStatus.uploaded_files !== batchPhotos.length ||
      batchStatus.uploading_files !== 0
    ) {
      throw new Error(
        `Photo batch ${batch.batch_id} is not ready to complete (${batchStatus.uploaded_files}/${batchPhotos.length} uploaded).`,
      );
    }

    await apiService.completePhotoBatch(batch.batch_id);
    for (const photo of batchPhotos) {
      await markSynced(
        "AccountsPhotosFiles",
        String(photo.ImageId),
        photo.sync_version,
      );
      uploadedPhotos += 1;
    }
  }

  return uploadedPhotos;
};

const toUploadRow = (row: Record<string, unknown>) => {
  const output = { ...row };
  delete output.__sync_version;
  delete output.__record_key;
  delete output.sync_version;
  const imageDataColumn = Object.keys(output).find(
    (column) => column.toLowerCase() === "imagedata",
  );
  if (imageDataColumn) delete output[imageDataColumn];
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
    `INSERT OR REPLACE INTO Accounts (${columnSql}) VALUES (${placeholders})`,
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
      "SELECT COALESCE(MAX(ACID), 0) as last_id FROM Accounts",
    );
    let downloaded = 0;

    options.onStatus?.(
      `Requesting accounts after ACID ${latestAccount?.last_id ?? 0}...`,
    );
    await apiService.syncDownload(
      {
        ...toDbCredentials(config),
        table_name: "Accounts",
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

    options.onStatus?.("Database sync complete. Preparing photo uploads...");
    const photos = await uploadPendingPhotos(options.onStatus);
    await addLog(
      "SUCCESS",
      `Upload completed. ${uploaded} records streamed and ${photos} photos uploaded.`,
    );
    return { records: uploaded, photos };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown sync upload error";
    await addLog("ERROR", message);
    throw error;
  }
};

import { getDB } from "@/db/database";
import { NumberingAccount } from "@/types";
import * as FileSystem from "expo-file-system/legacy";

const nowIso = () => new Date().toISOString();
const ACCOUNT_PHOTO_DIR = `${FileSystem.documentDirectory ?? ""}accounts_photos/`;

export const searchNumberingAccounts = async (filters: {
  wardNo?: string | null;
  propertyNo?: string | null;
  ownerName?: string | null;
}) => {
  const db = await getDB();
  return db.getAllAsync<NumberingAccount>(
    `SELECT
      acid as id,
      COALESCE(owner_name, '') as owner_name,
      COALESCE(holder_name, '') as holder_name,
      COALESCE(buildingname, '') as building_name,
      COALESCE(buildingno, '') as building_no,
      COALESCE(address, '') as address,
      COALESCE(hasgharkul, 0) as has_gharkul,
      COALESCE(numberingdone, 0) as numbering_done,
      COALESCE(numberingremarks, '') as numbering_remarks,
      COALESCE(photopath, '') as photo_path,
      COALESCE(o_onlineno, '') as o_online_no,
      o_zid as o_zid,
      o_wardno as o_ward_no,
      COALESCE(CAST(o_propertyno as TEXT), '') as o_property_no,
      COALESCE(CAST(o_partno as TEXT), '') as o_part_no,
      COALESCE(o_citysurveyno, '') as o_city_survey_no,
      COALESCE(o_plotno, '') as o_plot_no,
      opa as opa,
      o_totaltax as o_total_tax,
      zid as zid,
      wardno as ward_no,
      propertyno as property_no,
      partno as part_no,
      COALESCE(citysurveyno, '') as city_survey_no,
      COALESCE(plotno, '') as plot_no
    FROM accounts
    WHERE (? = '' OR CAST(wardno as TEXT) = ?)
      AND (? = '' OR CAST(propertyno as TEXT) = ?)
      AND (? = '' OR owner_name = ?)
    ORDER BY wardno, propertyno`,
    [
      filters.wardNo ?? "",
      filters.wardNo ?? "",

      filters.propertyNo ?? "",
      filters.propertyNo ?? "",
      filters.ownerName ?? "",
      filters.ownerName ?? "",
    ],
  );
};

export const getNumberingAccountById = async (id: number) => {
  const db = await getDB();
  return db.getFirstAsync<NumberingAccount>(
    `SELECT
      acid as id,
      COALESCE(owner_name, '') as owner_name,
      COALESCE(holder_name, '') as holder_name,
      COALESCE(buildingname, '') as building_name,
      COALESCE(buildingno, '') as building_no,
      COALESCE(address, '') as address,
      COALESCE(mobileno, '') as mobile_no,
      COALESCE(hasgharkul, 0) as has_gharkul,
      COALESCE(numberingdone, 0) as numbering_done,
      COALESCE(numberingremarks, '') as numbering_remarks,
      COALESCE(photopath, '') as photo_path,
      COALESCE(o_onlineno, '') as o_online_no,
      o_zid as o_zid,
      o_wardno as o_ward_no,
      COALESCE(CAST(o_propertyno as TEXT), '') as o_property_no,
      COALESCE(CAST(o_partno as TEXT), '') as o_part_no,
      COALESCE(o_citysurveyno, '') as o_city_survey_no,
      COALESCE(o_plotno, '') as o_plot_no,
      opa as opa,
      o_totaltax as o_total_tax,
      zid as zid,
      wardno as ward_no,
      propertyno as property_no,
      partno as part_no,
      COALESCE(citysurveyno, '') as city_survey_no,
      COALESCE(plotno, '') as plot_no
    FROM accounts WHERE acid = ?`,
    [id],
  );
};

export const getAccountsPhotos = async (accountId: number) => {
  const db = await getDB();
  const result = await db.getAllAsync<{
    ImageId: number;
    ACID: number;
    FileName: string;
    MimeType: string;
    ImagePath: string;
  }>(
    `SELECT
      imageid AS ImageId,
      acid AS ACID,
      filename AS FileName,
      mimetype AS MimeType,
      imagepath AS ImagePath
     FROM accountsphotos
     WHERE acid = ?`,
    [accountId],
  );
  return result;
};
export const getAccountPhotoCount = async (accountId: number) => {
  const db = await getDB();
  const result = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) as total FROM accountsphotos WHERE acid = ?",
    [accountId],
  );
  return result?.total ?? 0;
};

export const saveNumbering = async (payload: {
  propertyId: number;
  wardNo: number | null;
  propertyNo: number | null;
  partNo: number | null;
  address: string;
  buildingName: string;
  buildingNo: string;
  hasGharkul: boolean;
  remarks: string;
  photos: Array<{
    uri: string;
    fileName: string;
    mimeType: string;
  }>;
}) => {
  const db = await getDB();
  await db.runAsync(
    `UPDATE accounts SET
      wardno = ?,
      propertyno = ?,
      partno = ?,
      address = ?,
      buildingname = ?,
      buildingno = ?,
      hasgharkul = ?,
      numberingremarks = ?,
      numberingdone = 1,
      updated_at = ?,
      sync_version = COALESCE(sync_version, 0) + 1
     WHERE acid = ?`,
    [
      payload.wardNo || null,
      payload.propertyNo || null,
      payload.partNo || null,
      payload.address || null,
      payload.buildingName || null,
      payload.buildingNo || null,
      payload.hasGharkul ? 1 : 0,
      payload.remarks,
      nowIso(),
      payload.propertyId,
    ],
  );

  for (const photo of payload.photos) {
    const imagePath = await savePhotoToDeviceStorage(payload.propertyId, photo);
    await db.runAsync(
      `INSERT INTO accountsphotos
       (acid, filename, mimetype, imagepath, created_at, updated_at, sync_version)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [
        payload.propertyId,
        photo.fileName,
        photo.mimeType,
        imagePath,
        nowIso(),
        nowIso(),
      ],
    );
  }
};

const savePhotoToDeviceStorage = async (
  accountId: number,
  photo: { uri: string; fileName: string },
) => {
  const directoryInfo = await FileSystem.getInfoAsync(ACCOUNT_PHOTO_DIR);
  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(ACCOUNT_PHOTO_DIR, {
      intermediates: true,
    });
  }

  const safeFileName = photo.fileName.replace(/[^\w.-]/g, "_");
  const destination = `${ACCOUNT_PHOTO_DIR}${accountId}_${Date.now()}_${safeFileName}`;
  await FileSystem.copyAsync({
    from: photo.uri,
    to: destination,
  });
  return destination;
};

export const getWardNumbers = async (): Promise<string[]> => {
  const db = await getDB();
  const wards = await db.getAllAsync<{ ward_no: string }>(
    `SELECT DISTINCT CAST(wardno as TEXT) as ward_no FROM accounts WHERE wardno IS NOT NULL AND wardno != '' ORDER BY wardno`,
  );
  return wards.map((w) => w.ward_no);
};

export const getPropertyNumbers = async (wardNo: string): Promise<string[]> => {
  const db = await getDB();
  const properties = await db.getAllAsync<{ property_no: string }>(
    `SELECT DISTINCT CAST(propertyno as TEXT) as property_no FROM accounts WHERE propertyno IS NOT NULL AND propertyno != '' AND CAST(wardno as TEXT) = ? ORDER BY propertyno`,
    [wardNo],
  );
  return properties.map((p) => p.property_no);
};

export const getOwnerNames = async (filters?: {
  wardNo?: string;
  propertyNo?: string;
}): Promise<string[]> => {
  const db = await getDB();
  const owners = await db.getAllAsync<{ owner_name: string }>(
    `SELECT DISTINCT owner_name as owner_name
     FROM accounts
     WHERE owner_name IS NOT NULL
       AND owner_name != ''
       AND (? = '' OR CAST(wardno as TEXT) = ?)
       AND (? = '' OR CAST(propertyno as TEXT) = ?)
     ORDER BY owner_name`,
    [
      filters?.wardNo ?? "",
      filters?.wardNo ?? "",
      filters?.propertyNo ?? "",
      filters?.propertyNo ?? "",
    ],
  );
  return owners.map((o) => o.owner_name);
};

export const getHolderNames = async (): Promise<string[]> => {
  const db = await getDB();
  const holders = await db.getAllAsync<{ holder_name: string }>(
    `SELECT DISTINCT holder_name as holder_name FROM accounts WHERE holder_name IS NOT NULL AND holder_name != '' ORDER BY holder_name`,
  );
  return holders.map((h) => h.holder_name);
};

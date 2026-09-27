import { getDB } from "@/db/database";
import { NumberingAccount } from "@/types";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";

const nowIso = () => new Date().toISOString();
const PHOTO_EXPORT_DIRECTORY_KEY = "NPA_NUMBERING_PHOTO_EXPORT_DIRECTORY";
const PHOTO_EXPORT_FOLDER_NAME = "NPA_Property_Photos";

export const getNumberingPhotoExportDirectory = () =>
  AsyncStorage.getItem(PHOTO_EXPORT_DIRECTORY_KEY);

export const chooseNumberingPhotoExportDirectory = async () => {
  const { StorageAccessFramework } = FileSystem;
  const permission =
    await StorageAccessFramework.requestDirectoryPermissionsAsync(
      StorageAccessFramework.getUriForDirectoryInRoot("Download"),
    );
  if (!permission.granted) return null;

  const existingChildren = await StorageAccessFramework.readDirectoryAsync(
    permission.directoryUri,
  );
  const exportDirectory =
    existingChildren.find((uri) => {
      const finalSegment = decodeURIComponent(uri).split(/[/:]/).pop();
      return finalSegment === PHOTO_EXPORT_FOLDER_NAME;
    }) ??
    (await StorageAccessFramework.makeDirectoryAsync(
      permission.directoryUri,
      PHOTO_EXPORT_FOLDER_NAME,
    ));

  await AsyncStorage.setItem(PHOTO_EXPORT_DIRECTORY_KEY, exportDirectory);
  return exportDirectory;
};

export const searchNumberingAccounts = async (filters: {
  wardNo?: string | null;
  propertyNo?: string | null;
  ownerName?: string | null;
}) => {
  const db = await getDB();
  return db.getAllAsync<NumberingAccount>(
    `SELECT
      ACID as id,
      COALESCE(Owner_Name, '') as owner_name,
      COALESCE(Holder_Name, '') as holder_name,
      COALESCE(BuildingName, '') as building_name,
      COALESCE(BuildingNo, '') as building_no,
      COALESCE(Address, '') as address,
      COALESCE(HasGharkul, 0) as has_gharkul,
      COALESCE(numberingdone, 0) as numbering_done,
      COALESCE(numberingremarks, '') as numbering_remarks,
      COALESCE(PhotoPath, '') as photo_path,
      COALESCE(O_OnlineNo, '') as o_online_no,
      O_ZID as o_zid,
      O_WardNo as o_ward_no,
      COALESCE(CAST(O_PropertyNo as TEXT), '') as o_property_no,
      COALESCE(CAST(O_PartNo as TEXT), '') as o_part_no,
      COALESCE(O_CitySurveyNo, '') as o_city_survey_no,
      COALESCE(O_PlotNo, '') as o_plot_no,
      OPA as opa,
      O_TotalTax as o_total_tax,
      ZID as zid,
      WardNo as ward_no,
      PropertyNo as property_no,
      PartNo as part_no,
      COALESCE(CitySurveyNo, '') as city_survey_no,
      COALESCE(PlotNo, '') as plot_no
    FROM Accounts
    WHERE (? = '' OR CAST(WardNo as TEXT) = ?)
      AND (? = '' OR CAST(PropertyNo as TEXT) = ?)
      AND (? = '' OR Owner_Name = ?)
    ORDER BY WardNo, PropertyNo`,
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
      ACID as id,
      COALESCE(Owner_Name, '') as owner_name,
      COALESCE(Holder_Name, '') as holder_name,
      COALESCE(BuildingName, '') as building_name,
      COALESCE(BuildingNo, '') as building_no,
      COALESCE(Address, '') as address,
      COALESCE(MobileNo, '') as mobile_no,
      COALESCE(HasGharkul, 0) as has_gharkul,
      COALESCE(numberingdone, 0) as numbering_done,
      COALESCE(numberingremarks, '') as numbering_remarks,
      COALESCE(PhotoPath, '') as photo_path,
      COALESCE(O_OnlineNo, '') as o_online_no,
      O_ZID as o_zid,
      O_WardNo as o_ward_no,
      COALESCE(CAST(O_PropertyNo as TEXT), '') as o_property_no,
      COALESCE(CAST(O_PartNo as TEXT), '') as o_part_no,
      COALESCE(O_CitySurveyNo, '') as o_city_survey_no,
      COALESCE(O_PlotNo, '') as o_plot_no,
      OPA as opa,
      O_TotalTax as o_total_tax,
      ZID as zid,
      WardNo as ward_no,
      PropertyNo as property_no,
      PartNo as part_no,
      COALESCE(CitySurveyNo, '') as city_survey_no,
      COALESCE(PlotNo, '') as plot_no
    FROM Accounts WHERE ACID = ?`,
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
      ImageId AS ImageId,
      ACID AS ACID,
      FileName AS FileName,
      MimeType AS MimeType,
      ImagePath AS ImagePath
         FROM AccountsPhotos
         WHERE ACID = ?`,
    [accountId],
  );
  return result;
};
export const getAccountPhotoCount = async (accountId: number) => {
  const db = await getDB();
  const result = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) as total FROM AccountsPhotos WHERE ACID = ?",
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
  let photoPaths: string[] = [];
  if (payload.photos.length > 0) {
    const exportDirectory = await getNumberingPhotoExportDirectory();
    if (!exportDirectory) {
      throw new Error("Choose a photo folder before saving photos.");
    }
    photoPaths = await Promise.all(
      payload.photos.map((photo) =>
        exportPhotoToSelectedDirectory(
          payload.propertyId,
          photo,
          exportDirectory,
        ),
      ),
    );
  }

  await db.runAsync(
    `UPDATE Accounts SET
      WardNo = ?,
      PropertyNo = ?,
      PartNo = ?,
      Address = ?,
      BuildingName = ?,
      BuildingNo = ?,
      HasGharkul = ?,
      numberingremarks = ?,
      numberingdone = 1,
      updated_at = ?,
      sync_version = COALESCE(sync_version, 0) + 1
    WHERE ACID = ?`,
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

  for (let index = 0; index < payload.photos.length; index += 1) {
    const photo = payload.photos[index];
    await db.runAsync(
      `INSERT INTO AccountsPhotos
       (ACID, FileName, MimeType, ImagePath, created_at, updated_at, sync_version)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [
        payload.propertyId,
        photo.fileName,
        photo.mimeType,
        photoPaths[index],
        nowIso(),
        nowIso(),
      ],
    );
  }

  return { exportedPhotos: photoPaths.length, failedExports: 0 };
};

const exportPhotoToSelectedDirectory = async (
  accountId: number,
  photo: { uri: string; fileName: string; mimeType: string },
  directoryUri: string,
): Promise<string> => {
  const safeFileName = photo.fileName.replace(/[^\w.-]/g, "_");
  const extensionIndex = safeFileName.lastIndexOf(".");
  const extension =
    extensionIndex > 0 ? safeFileName.slice(extensionIndex) : "";
  const baseName =
    extensionIndex > 0 ? safeFileName.slice(0, extensionIndex) : safeFileName;
  const exportFileName = `${accountId}_${Date.now()}_${baseName}${extension}`;
  const targetUri = await FileSystem.StorageAccessFramework.createFileAsync(
    directoryUri,
    extension ? exportFileName.slice(0, -extension.length) : exportFileName,
    photo.mimeType,
  );
  const contents = await FileSystem.readAsStringAsync(photo.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  await FileSystem.StorageAccessFramework.writeAsStringAsync(
    targetUri,
    contents,
    {
      encoding: FileSystem.EncodingType.Base64,
    },
  );
  return targetUri;
};

export const getWardNumbers = async (): Promise<string[]> => {
  const db = await getDB();
  const wards = await db.getAllAsync<{ ward_no: string }>(
    `SELECT DISTINCT CAST(WardNo as TEXT) as ward_no FROM Accounts WHERE WardNo IS NOT NULL AND WardNo != '' ORDER BY WardNo`,
  );
  return wards.map((w) => w.ward_no);
};

export const getPropertyNumbers = async (wardNo: string): Promise<string[]> => {
  const db = await getDB();
  const properties = await db.getAllAsync<{ property_no: string }>(
    `SELECT DISTINCT CAST(PropertyNo as TEXT) as property_no FROM Accounts WHERE PropertyNo IS NOT NULL AND PropertyNo != '' AND CAST(WardNo as TEXT) = ? ORDER BY PropertyNo`,
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
    `SELECT DISTINCT Owner_Name as owner_name
     FROM Accounts
     WHERE Owner_Name IS NOT NULL
       AND Owner_Name != ''
       AND (? = '' OR CAST(WardNo as TEXT) = ?)
       AND (? = '' OR CAST(PropertyNo as TEXT) = ?)
     ORDER BY Owner_Name`,
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
    `SELECT DISTINCT Holder_Name as holder_name FROM Accounts WHERE Holder_Name IS NOT NULL AND Holder_Name != '' ORDER BY Holder_Name`,
  );
  return holders.map((h) => h.holder_name);
};

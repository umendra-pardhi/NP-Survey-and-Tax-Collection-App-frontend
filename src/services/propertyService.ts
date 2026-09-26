import { getDB } from "@/db/database";
import { PropertyRow } from "@/types";

export const searchProperties = async (filters: {
  wardNo?: string;
  propertyNo?: string;
  partNo?: string;
  ownerName?: string;
}) => {
  const db = await getDB();
  const rows = await db.getAllAsync<PropertyRow>(
    `SELECT 
      acid as id,
      COALESCE(CAST(wardno as TEXT), '') as ward_no,
      COALESCE(CAST(propertyno as TEXT), '') as property_no,
      COALESCE(CAST(partno as TEXT), '') as part_no,
      COALESCE(owner_name, '') as owner_name,
      COALESCE(address, '') as address,
      COALESCE(CAST(puid as TEXT), '') as property_type,
      '' as floor_info,
      COALESCE(haswaterconnection, 0) as water_connection,
      '' as toilet_info,
      CASE WHEN COALESCE(numberingdone,0)=1 THEN 'DONE' ELSE 'PENDING' END as numbering_status,
      CASE WHEN COALESCE(surveydone,0)=1 THEN 'DONE' ELSE 'PENDING' END as survey_status,
      'PENDING' as tax_status,
      '' as updated_at
     FROM accounts
     WHERE (? = '' OR CAST(wardno as TEXT) LIKE ?)
       AND (? = '' OR CAST(propertyno as TEXT) LIKE ?)
       AND (? = '' OR CAST(partno as TEXT) LIKE ?)
       AND (? = '' OR owner_name LIKE ?)
     ORDER BY wardno, propertyno`,
    [
      filters.wardNo ?? "",
      `%${filters.wardNo ?? ""}%`,
      filters.propertyNo ?? "",
      `%${filters.propertyNo ?? ""}%`,
      filters.partNo ?? "",
      `%${filters.partNo ?? ""}%`,
      filters.ownerName ?? "",
      `%${filters.ownerName ?? ""}%`,
    ],
  );
  return rows;
};

export const getPropertyById = async (id: number) => {
  const db = await getDB();
  return db.getFirstAsync<PropertyRow>(
    `SELECT 
      acid as id,
      COALESCE(CAST(wardno as TEXT), '') as ward_no,
      COALESCE(CAST(propertyno as TEXT), '') as property_no,
      COALESCE(CAST(partno as TEXT), '') as part_no,
      COALESCE(owner_name, '') as owner_name,
      COALESCE(address, '') as address,
      COALESCE(CAST(puid as TEXT), '') as property_type,
      '' as floor_info,
      COALESCE(haswaterconnection, 0) as water_connection,
      '' as toilet_info,
      CASE WHEN COALESCE(numberingdone,0)=1 THEN 'DONE' ELSE 'PENDING' END as numbering_status,
      CASE WHEN COALESCE(surveydone,0)=1 THEN 'DONE' ELSE 'PENDING' END as survey_status,
      'PENDING' as tax_status,
      '' as updated_at
    FROM accounts WHERE acid = ?`,
    [id],
  );
};

export const getFlowStats = async () => {
  const db = await getDB();
  const total = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) as total FROM accounts",
  );
  const numbered = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) as total FROM accounts WHERE COALESCE(numberingdone,0)=1",
  );
  const surveyed = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) as total FROM accounts WHERE COALESCE(surveydone,0)=1",
  );
  const taxed = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) as total FROM taxpayments",
  );
  return {
    total: total?.total ?? 0,
    numbered: numbered?.total ?? 0,
    surveyed: surveyed?.total ?? 0,
    taxed: taxed?.total ?? 0,
  };
};

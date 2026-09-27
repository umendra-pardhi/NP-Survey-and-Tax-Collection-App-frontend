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
      ACID as id,
      COALESCE(CAST(WardNo as TEXT), '') as ward_no,
      COALESCE(CAST(PropertyNo as TEXT), '') as property_no,
      COALESCE(CAST(PartNo as TEXT), '') as part_no,
      COALESCE(Owner_Name, '') as owner_name,
      COALESCE(Address, '') as address,
      COALESCE(CAST(PUID as TEXT), '') as property_type,
      '' as floor_info,
      COALESCE(HasWaterConnection, 0) as water_connection,
      '' as toilet_info,
      CASE WHEN COALESCE(numberingdone,0)=1 THEN 'DONE' ELSE 'PENDING' END as numbering_status,
      CASE WHEN COALESCE(surveydone,0)=1 THEN 'DONE' ELSE 'PENDING' END as survey_status,
      'PENDING' as tax_status,
      '' as updated_at
     FROM Accounts
     WHERE (? = '' OR CAST(WardNo as TEXT) LIKE ?)
       AND (? = '' OR CAST(PropertyNo as TEXT) LIKE ?)
       AND (? = '' OR CAST(PartNo as TEXT) LIKE ?)
       AND (? = '' OR Owner_Name LIKE ?)
     ORDER BY WardNo, PropertyNo`,
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
      ACID as id,
      COALESCE(CAST(WardNo as TEXT), '') as ward_no,
      COALESCE(CAST(PropertyNo as TEXT), '') as property_no,
      COALESCE(CAST(PartNo as TEXT), '') as part_no,
      COALESCE(Owner_Name, '') as owner_name,
      COALESCE(Address, '') as address,
      COALESCE(CAST(PUID as TEXT), '') as property_type,
      '' as floor_info,
      COALESCE(HasWaterConnection, 0) as water_connection,
      '' as toilet_info,
      CASE WHEN COALESCE(numberingdone,0)=1 THEN 'DONE' ELSE 'PENDING' END as numbering_status,
      CASE WHEN COALESCE(surveydone,0)=1 THEN 'DONE' ELSE 'PENDING' END as survey_status,
      'PENDING' as tax_status,
      '' as updated_at
    FROM Accounts WHERE ACID = ?`,
    [id],
  );
};

export const getFlowStats = async () => {
  const db = await getDB();
  const total = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) as total FROM Accounts",
  );
  const numbered = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) as total FROM Accounts WHERE COALESCE(numberingdone,0)=1",
  );
  const surveyed = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) as total FROM Accounts WHERE COALESCE(surveydone,0)=1",
  );
  const taxed = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) as total FROM TaxPayments",
  );
  return {
    total: total?.total ?? 0,
    numbered: numbered?.total ?? 0,
    surveyed: surveyed?.total ?? 0,
    taxed: taxed?.total ?? 0,
  };
};

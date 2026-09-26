import { getDB } from "@/db/database";

const nowIso = () => new Date().toISOString();

export const saveSurvey = async (payload: {
  propertyId: number;
  surveyorId: number;
  mobile: string;
  tenantInfo: string;
  isDraft: number;
}) => {
  const db = await getDB();
  await db.runAsync(
    "UPDATE accounts SET mobileno = ?, tenantname = ?, surveydone = ?, remark1 = ?, updated_at = ?, sync_version = COALESCE(sync_version, 0) + 1 WHERE acid = ?",
    [
      payload.mobile,
      payload.tenantInfo,
      payload.isDraft === 0 ? 1 : 0,
      null,
      nowIso(),
      payload.propertyId,
    ],
  );

  if (payload.isDraft === 0) {
    await db.runAsync(
      "UPDATE accounts SET surveydone = 1, updated_at = ?, sync_version = COALESCE(sync_version, 0) + 1 WHERE acid = ?",
      [nowIso(), payload.propertyId],
    );
  }
};

export const addSurveyMember = async (payload: {
  propertyId: number;
  name: string;
  age: number;
  relation: string;
}) => {
  const db = await getDB();
  await db.runAsync(
    "INSERT INTO assessment (acid, propertydescription, floor, con_year, prop_use, updated_at, sync_version) VALUES (?, ?, ?, ?, ?, ?, 1)",
    [
      payload.propertyId,
      payload.name,
      payload.relation,
      payload.age,
      "MEMBER",
      nowIso(),
    ],
  );
};

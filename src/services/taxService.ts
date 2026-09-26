import { getDB } from "@/db/database";
import { TaxBreakdown } from "@/types";

const nowIso = () => new Date().toISOString();

export const calcTotalTax = (taxes: TaxBreakdown) =>
  taxes.propertyTax +
  taxes.sanitationTax +
  taxes.lightingTax +
  taxes.healthTax +
  taxes.educationTax;

export const saveTaxRecord = async (payload: {
  propertyId: number;
  collectorId: number;
  previousTax: number;
  taxes: TaxBreakdown;
  paidAmount: number;
  paymentMode: string;
}) => {
  const db = await getDB();
  const totalTax = calcTotalTax(payload.taxes);
  const existingPaid = await db.getFirstAsync<{ AmountPaid: number }>(
    "SELECT amountpaid AS AmountPaid FROM taxpayments WHERE acid = ? ORDER BY pyid DESC LIMIT 1",
    [payload.propertyId],
  );

  if ((existingPaid?.AmountPaid ?? 0) >= totalTax && payload.paidAmount > 0) {
    throw new Error("Payment already completed for this property.");
  }

  const receiptNo = `R-${Date.now()}`;
  await db.runAsync(
    `INSERT INTO taxpayments
    (recno, acid, ddate, sumprevious, sumcurrent, totalpayableamt, amountpaid, paymentmode, receiver, tranid, updated_at, sync_version)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [
      Number(Date.now().toString().slice(-8)),
      payload.propertyId,
      nowIso(),
      payload.previousTax,
      totalTax,
      totalTax,
      payload.paidAmount,
      payload.paymentMode,
      String(payload.collectorId),
      0,
      nowIso(),
    ],
  );

  return receiptNo;
};

export const getLatestTaxByProperty = async (propertyId: number) => {
  const db = await getDB();
  return db.getFirstAsync<{
    prev_tax: number;
    total_tax: number;
    paid_amount: number;
    receipt_no: string;
    paid_on: string;
  }>(
    `SELECT
      COALESCE(sumprevious,0) as prev_tax,
      COALESCE(totalpayableamt,0) as total_tax,
      COALESCE(amountpaid,0) as paid_amount,
      CAST(recno as TEXT) as receipt_no,
      ddate as paid_on
         FROM taxpayments WHERE acid = ? ORDER BY pyid DESC LIMIT 1`,
    [propertyId],
  );
};

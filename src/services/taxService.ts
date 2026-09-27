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
    "SELECT AmountPaid AS AmountPaid FROM TaxPayments WHERE ACID = ? ORDER BY PYID DESC LIMIT 1",
    [payload.propertyId],
  );

  if ((existingPaid?.AmountPaid ?? 0) >= totalTax && payload.paidAmount > 0) {
    throw new Error("Payment already completed for this property.");
  }

  const receiptNo = `R-${Date.now()}`;
  await db.runAsync(
    `INSERT INTO TaxPayments
    (RECNO, ACID, DDate, SumPrevious, SumCurrent, TotalPayableAmt, AmountPaid, PaymentMode, Receiver, TRANID, updated_at, sync_version)
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
      COALESCE(SumPrevious,0) as prev_tax,
      COALESCE(TotalPayableAmt,0) as total_tax,
      COALESCE(AmountPaid,0) as paid_amount,
      CAST(RECNO as TEXT) as receipt_no,
      DDate as paid_on
        FROM TaxPayments WHERE ACID = ? ORDER BY PYID DESC LIMIT 1`,
    [propertyId],
  );
};

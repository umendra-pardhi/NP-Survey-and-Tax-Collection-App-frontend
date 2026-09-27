export const DB_SCHEMA_SQL = `
PRAGMA journal_mode = WAL;

PRAGMA foreign_keys = ON;

-- ============================================================
-- Accounts
-- ============================================================

CREATE TABLE IF NOT EXISTS Accounts (
    ACID INTEGER PRIMARY KEY AUTOINCREMENT,
    ClientID INTEGER,
    LedgerID INTEGER,
    ZID INTEGER,
    WardNo INTEGER,
    PropertyNo INTEGER,
    PartNo INTEGER,
    CitySurveyNo TEXT,
    PlotNo TEXT,
    O_OnlineNo TEXT,
    O_ZID INTEGER,
    O_WardNo INTEGER,
    O_PropertyNo TEXT,
    O_PartNo TEXT,
    O_CitySurveyNo TEXT,
    O_PlotNo TEXT,
    Aadhar_No TEXT,
    CTID INTEGER,
    PUID INTEGER,
    O_TotalTax REAL,
    Owner_Name TEXT,
    Holder_Name TEXT,
    Wife_Name TEXT,
    BuildingName TEXT,
    BuildingNo TEXT,
    Address TEXT,
    MobileNo TEXT,
    Exchange TEXT,
    HasToilet INTEGER,
    ToiletSeats1 INTEGER,
    ToiletSeats2 INTEGER,
    HasWaterConnection INTEGER,
    TotalWaterConnections INTEGER,
    HasSolarElectricity INTEGER,
    HasRainWaterHarvesting INTEGER,
    HasTree INTEGER,
    Boundry_East TEXT,
    Boundry_West TEXT,
    Boundry_North TEXT,
    Boundry_South TEXT,
    LengthOnEast REAL,
    LengthOnWest REAL,
    LengthOnNorth REAL,
    LengthOnSouth REAL,
    Avg_Length REAL,
    Avg_Breadth REAL,
    Area REAL,
    OPA REAL,
    Gharkul INTEGER DEFAULT 0,
    HasGharkul INTEGER DEFAULT 0,
    TreeNos INTEGER DEFAULT 0,
    HasTenant INTEGER DEFAULT 0,
    HasBore INTEGER DEFAULT 0,
    HasWell INTEGER DEFAULT 0,
    TenantName TEXT,
    PhotoPath TEXT,
    MapPath TEXT,
    "Length" REAL DEFAULT 0,
    Breadth REAL DEFAULT 0,
    AsmComplete INTEGER NOT NULL DEFAULT 0,
    oldbuiltuparea REAL DEFAULT 0,
    Remark1 TEXT,
    Remark2 TEXT,
    HasTower INTEGER DEFAULT 0,
    ManualRatableValue INTEGER DEFAULT 0,
    ManualTax INTEGER DEFAULT 0,
    Remarks3 TEXT,
    PropertyKNRNo TEXT,
    WaterKNRNo TEXT,
    numberingremarks TEXT,
    numberingdone INTEGER,
    surveydone INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- AccountsPhotos
-- ============================================================

CREATE TABLE IF NOT EXISTS AccountsPhotos (
    ImageId INTEGER PRIMARY KEY AUTOINCREMENT,
    ACID INTEGER NOT NULL,
    FileName TEXT,
    MimeType TEXT,
    ImagePath TEXT NOT NULL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1,

    FOREIGN KEY (ACID)
        REFERENCES Accounts(ACID)
);


-- ============================================================
-- AssessedTax
-- ============================================================

CREATE TABLE IF NOT EXISTS AssessedTax (
    ACID INTEGER,
    TaxID INTEGER,
    Amount REAL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- AssessedTaxCapital
-- ============================================================

CREATE TABLE IF NOT EXISTS AssessedTaxCapital (
    ACID INTEGER,
    TaxID INTEGER,
    Amount REAL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- AssessedTaxCapitalDetails
-- ============================================================

CREATE TABLE IF NOT EXISTS AssessedTaxCapitalDetails (
    ACID INTEGER,
    PropertyDescription TEXT,
    PDID INTEGER,
    TAXID INTEGER,
    AMOUNT INTEGER DEFAULT 0,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- AssessedTaxRent
-- ============================================================

CREATE TABLE IF NOT EXISTS AssessedTaxRent (
    ACID INTEGER,
    TaxID INTEGER,
    Amount REAL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- AssessedTaxRentDetails
-- ============================================================

CREATE TABLE IF NOT EXISTS AssessedTaxRentDetails (
    ACID INTEGER,
    PropertyDescription TEXT,
    PDID INTEGER,
    TAXID INTEGER,
    AMOUNT INTEGER DEFAULT 0,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- Assessment
-- ============================================================

CREATE TABLE IF NOT EXISTS Assessment (
    ASID INTEGER PRIMARY KEY AUTOINCREMENT,
    ACID INTEGER,
    PropertyDescription TEXT,
    Floor TEXT,
    con_year INTEGER,
    con_type TEXT,
    prop_use TEXT,
    areaft REAL,
    areamt REAL,
    ratesqmt REAL,
    monthly_rent REAL,
    annual_rent REAL,
    annual_tax_value REAL,
    dep_per REAL,
    dep_amt REAL,
    gap REAL,
    ff REAL,
    weightage REAL,
    taxable_amt REAL,
    zone_point REAL,
    PDID INTEGER,
    CTID INTEGER,
    PUID INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- AssessmentCapital
-- ============================================================

CREATE TABLE IF NOT EXISTS AssessmentCapital (
    ACID INTEGER,
    PropertyDescription TEXT,
    floor TEXT,
    con_year INTEGER,
    ass_year INTEGER,
    con_type TEXT,
    prop_use TEXT,
    areaft REAL,
    areamt REAL,
    ratesqmt REAL,
    monthly_rent REAL,
    annual_rent REAL,
    annual_tax_value REAL,
    dep_per REAL,
    dep_amt REAL,
    gap REAL,
    ff REAL,
    weightage REAL,
    taxable_amt REAL,
    zone_point REAL,
    PDID INTEGER,
    CTID INTEGER,
    PUID INTEGER,
    rep_per REAL DEFAULT 0,
    rep_amt INTEGER DEFAULT 0,
    ManualRatableValue INTEGER DEFAULT 0,
    BuildingNo TEXT,
    Holder TEXT,
    srnid INTEGER DEFAULT 0,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- AssessmentRent
-- ============================================================

CREATE TABLE IF NOT EXISTS AssessmentRent (
    ACID INTEGER,
    PropertyDescription TEXT,
    floor TEXT,
    con_year INTEGER,
    ass_year INTEGER,
    con_type TEXT,
    prop_use TEXT,
    areaft REAL,
    areamt REAL,
    ratesqmt REAL,
    monthly_rent REAL,
    annual_rent REAL,
    annual_tax_value REAL,
    dep_per REAL,
    dep_amt REAL,
    gap REAL,
    ff REAL,
    weightage REAL,
    taxable_amt REAL,
    zone_point REAL,
    PDID INTEGER,
    CTID INTEGER,
    PUID INTEGER,
    SrNo INTEGER,
    SRNID INTEGER,
    rep_per REAL DEFAULT 0,
    rep_amt INTEGER DEFAULT 0,
    ManualRatableValue INTEGER DEFAULT 0,
    BuildingNo TEXT,
    Holder TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- Capital_DepRateOnCT
-- ============================================================

CREATE TABLE IF NOT EXISTS Capital_DepRateOnCT (
    DepID INTEGER PRIMARY KEY AUTOINCREMENT,
    ClientID INTEGER,
    MinYear INTEGER,
    MaxYear INTEGER,
    CTID INTEGER,
    ZID INTEGER,
    Per REAL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- CarpetAreas
-- ============================================================

CREATE TABLE IF NOT EXISTS CarpetAreas (
    ACID INTEGER,
    PropID INTEGER,
    CarID INTEGER,
    "Length" REAL,
    Breadth REAL,
    Area REAL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- Clients
-- ============================================================

CREATE TABLE IF NOT EXISTS Clients (
    ClientID INTEGER PRIMARY KEY AUTOINCREMENT,
    ClientName TEXT,
    ClientType TEXT,
    TalukaID INTEGER,
    DistID INTEGER,
    StateID INTEGER,
    Pincode TEXT,
    MobileNo TEXT,
    PhoneNo TEXT,
    Remarks TEXT,
    AskBoundry INTEGER,
    ValuationMethod INTEGER,
    Start_year INTEGER,
    End_year INTEGER,
    Sign1Auth TEXT,
    Sign2Auth TEXT,
    Sign3Auth TEXT,
    Sign1 BLOB,
    Sign2 BLOB,
    Sign3 BLOB,
    Logo BLOB,
    SeparateWaterTax INTEGER,
    TaxOnArea INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- ConstructionTypes
-- ============================================================

CREATE TABLE IF NOT EXISTS ConstructionTypes (
    CTID INTEGER PRIMARY KEY AUTOINCREMENT,
    ConstructionType TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- DefaultLedgers
-- ============================================================

CREATE TABLE IF NOT EXISTS DefaultLedgers (
    DLID INTEGER PRIMARY KEY AUTOINCREMENT,
    LedgerIdentity TEXT,
    LedgerID INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- DemandTemplate
-- ============================================================

CREATE TABLE IF NOT EXISTS DemandTemplate (
    TempID INTEGER PRIMARY KEY AUTOINCREMENT,
    OrderNo INTEGER DEFAULT 0,
    TaxID INTEGER DEFAULT 0,
    LedgerID INTEGER DEFAULT 0,
    ItemType TEXT,
    Heading TEXT,
    "Attribute" TEXT,
    "Range" TEXT,
    Expression TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- Districts
-- ============================================================

CREATE TABLE IF NOT EXISTS Districts (
    DistID INTEGER PRIMARY KEY AUTOINCREMENT,
    DistrictName TEXT,
    StateID INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- EduTaxRates
-- ============================================================

CREATE TABLE IF NOT EXISTS EduTaxRates (
    RangeFrom INTEGER,
    RangeTo INTEGER,
    Per1 REAL,
    Per2 REAL,
    TaxID INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- EmpTaxRates
-- ============================================================

CREATE TABLE IF NOT EXISTS EmpTaxRates (
    RangeFrom INTEGER,
    RangeTo INTEGER,
    Per REAL,
    TaxID INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- FinancialYears
-- ============================================================

CREATE TABLE IF NOT EXISTS FinancialYears (
    FYID INTEGER PRIMARY KEY AUTOINCREMENT,
    YearFrom INTEGER,
    YearTo INTEGER,
    Selected INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- FloorFactor
-- ============================================================

CREATE TABLE IF NOT EXISTS FloorFactor (
    FLRID INTEGER PRIMARY KEY AUTOINCREMENT,
    ClientID INTEGER,
    ZID INTEGER,
    Floor TEXT,
    Factor REAL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- LGIS
-- ============================================================

CREATE TABLE IF NOT EXISTS LGIS (
    LGIID INTEGER PRIMARY KEY AUTOINCREMENT,
    InstituteTypeName TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- LedgerTypes
-- ============================================================

CREATE TABLE IF NOT EXISTS LedgerTypes (
    LTID INTEGER,
    LedgerType TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- Ledgers
-- ============================================================

CREATE TABLE IF NOT EXISTS Ledgers (
    LedgerID INTEGER PRIMARY KEY AUTOINCREMENT,
    LedgerName TEXT,
    LedgerType INTEGER,
    ClientID INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- PhotosMaps
-- ============================================================

CREATE TABLE IF NOT EXISTS PhotosMaps (
    ClientID INTEGER,
    ACID INTEGER NOT NULL,
    Photo BLOB,
    "Map" BLOB,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- PropertyDesc
-- ============================================================

CREATE TABLE IF NOT EXISTS PropertyDesc (
    PDID INTEGER PRIMARY KEY AUTOINCREMENT,
    PropertyDescription TEXT,
    Weightage REAL DEFAULT 0.0,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- PropertyUsage
-- ============================================================

CREATE TABLE IF NOT EXISTS PropertyUsage (
    PUID INTEGER PRIMARY KEY AUTOINCREMENT,
    PropertyUse TEXT,
    PDID INTEGER,
    TaxAmount INTEGER DEFAULT 0,
    GWTax INTEGER DEFAULT 0,
    SWTax INTEGER DEFAULT 0,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- PropertyUsageOld
-- ============================================================

CREATE TABLE IF NOT EXISTS PropertyUsageOld (
    PUID INTEGER PRIMARY KEY AUTOINCREMENT,
    PropertyUse TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- RECOUNT
-- ============================================================

CREATE TABLE IF NOT EXISTS RECOUNT (
    RID INTEGER,
    RType TEXT,
    FYID INTEGER,
    RECNO INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- RateOnCTZonewise_Capital
-- ============================================================

CREATE TABLE IF NOT EXISTS RateOnCTZonewise_Capital (
    CTZRID INTEGER PRIMARY KEY AUTOINCREMENT,
    ClientID INTEGER,
    ZID INTEGER,
    CTID INTEGER,
    Rate INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- RateOnCTZonewise_Rent
-- ============================================================

CREATE TABLE IF NOT EXISTS RateOnCTZonewise_Rent (
    CTZRID INTEGER PRIMARY KEY AUTOINCREMENT,
    ClientID INTEGER,
    ZID INTEGER,
    CTID INTEGER,
    Rate INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- ReceiptTemplate
-- ============================================================

CREATE TABLE IF NOT EXISTS ReceiptTemplate (
    TempID INTEGER PRIMARY KEY AUTOINCREMENT,
    OrderNo INTEGER DEFAULT 0,
    TaxID INTEGER DEFAULT 0,
    LedgerID INTEGER DEFAULT 0,
    ItemType TEXT,
    Heading TEXT,
    "Attribute" TEXT,
    "Range" TEXT,
    Expression TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- Rent_DepRateOnCT
-- ============================================================

CREATE TABLE IF NOT EXISTS Rent_DepRateOnCT (
    DepID INTEGER PRIMARY KEY AUTOINCREMENT,
    ClientID INTEGER,
    MinYear INTEGER,
    MaxYear INTEGER,
    CTID INTEGER,
    Per REAL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- Rent_RepairingRateOnCT
-- ============================================================

CREATE TABLE IF NOT EXISTS Rent_RepairingRateOnCT (
    RepID INTEGER PRIMARY KEY AUTOINCREMENT,
    ClientID INTEGER,
    MinYear INTEGER,
    MaxYear INTEGER,
    CTID INTEGER,
    Per REAL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- Settings
-- ============================================================

CREATE TABLE IF NOT EXISTS Settings (
    SettingName TEXT,
    StringValue TEXT,
    IntegerValue INTEGER,
    FloatValue REAL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- States
-- ============================================================

CREATE TABLE IF NOT EXISTS States (
    StateID INTEGER PRIMARY KEY AUTOINCREMENT,
    StateName TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- TaxDemandPaymentDetails
-- ============================================================

CREATE TABLE IF NOT EXISTS TaxDemandPaymentDetails (
    DID INTEGER,
    TaxID INTEGER,
    PreviousBalance INTEGER DEFAULT 0,
    CurrentBalance INTEGER DEFAULT 0,
    PreviousPaid INTEGER DEFAULT 0,
    CurrentPaid INTEGER DEFAULT 0,
    RemPreviousBalance INTEGER DEFAULT 0,
    RemCurrentBalance INTEGER DEFAULT 0,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- TaxDemands
-- ============================================================

CREATE TABLE IF NOT EXISTS TaxDemands (
    DID INTEGER PRIMARY KEY AUTOINCREMENT,
    RECNO INTEGER NOT NULL,
    ACID INTEGER,
    DDate TEXT,
    FYID INTEGER,
    SumPrevious INTEGER,
    SumNew INTEGER,
    SumTotal INTEGER,
    ExAdjustment INTEGER,
    Advance INTEGER,
    Adjustment INTEGER,
    Discount INTEGER,
    TotalPayableAmt INTEGER,
    InWords TEXT,
    DPAID INTEGER,
    TranID INTEGER,
    WaterTax REAL,
    Locked INTEGER DEFAULT 0,
    MainDemand INTEGER NOT NULL DEFAULT 0,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- TaxPaymentDetails
-- ============================================================

CREATE TABLE IF NOT EXISTS TaxPaymentDetails (
    PYID INTEGER,
    DID INTEGER,
    TaxID INTEGER,
    LedgerID INTEGER,
    BalancePaid REAL,
    CurrentPaid REAL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- TaxPayments
-- ============================================================

CREATE TABLE IF NOT EXISTS TaxPayments (
    PYID INTEGER PRIMARY KEY AUTOINCREMENT,
    DID INTEGER,
    RECNO INTEGER,
    ACID INTEGER,
    DDate TEXT,
    FYID INTEGER,
    SumPrevious REAL,
    SumCurrent REAL,
    ExAdjustment REAL,
    Advance REAL,
    Discount REAL,
    CashDiscount REAL,
    BalanceAmt REAL,
    ExcessAmt REAL,
    WaterTax REAL,
    TotalBillAmt REAL,
    TotalPayableAmt REAL,
    AmountPaid REAL,
    InWords TEXT,
    PaymentMode TEXT,
    InstrumentNo TEXT,
    InstrumentDate TEXT,
    BankName TEXT,
    Receiver TEXT,
    ReceivedFrom TEXT,
    TRANID INTEGER,
    Penalty REAL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- TaxRates
-- ============================================================

CREATE TABLE IF NOT EXISTS TaxRates (
    MinArea INTEGER,
    MaxArea INTEGER,
    Amount REAL,
    Per REAL,
    TSRate1 INTEGER DEFAULT 0,
    TSRate2 INTEGER DEFAULT 0,
    TaxID INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- TaxTypes
-- ============================================================

CREATE TABLE IF NOT EXISTS TaxTypes (
    TaxID INTEGER PRIMARY KEY AUTOINCREMENT,
    TaxType TEXT,
    TaxOverToiletSeat INTEGER DEFAULT 0,
    TaxOnWaterConnection INTEGER,
    TaxOnWholeProperty INTEGER,
    EducationTax INTEGER,
    EmploymentTax INTEGER,
    UsageTax INTEGER DEFAULT 0,
    PropertyTax INTEGER DEFAULT 0,
    FireSafetyTax INTEGER DEFAULT 0,
    AdvtTax INTEGER DEFAULT 0,
    SpecialTax INTEGER DEFAULT 0,
    OrdNo INTEGER,
    fix INTEGER,
    ValuedOn INTEGER,
    LedgerID INTEGER,
    OldTax INTEGER DEFAULT 0,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- Taxprodeal
-- ============================================================

CREATE TABLE IF NOT EXISTS Taxprodeal (
    PDID INTEGER,
    TaxID INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- TowerTaxPer
-- ============================================================

CREATE TABLE IF NOT EXISTS TowerTaxPer (
    ID INTEGER,
    TowerPer INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- Transactions
-- ============================================================

CREATE TABLE IF NOT EXISTS Transactions (
    TranID INTEGER PRIMARY KEY AUTOINCREMENT,
    FYID INTEGER,
    TranDate TEXT,
    VoucherType INTEGER,
    VoucherNo INTEGER,
    TranDetails TEXT,
    Remarks TEXT,
    Amount REAL,
    UserID INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- UsageLog
-- ============================================================

CREATE TABLE IF NOT EXISTS UsageLog (
    LogID INTEGER PRIMARY KEY AUTOINCREMENT,
    LogType TEXT,
    Description TEXT,
    LogDate TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- Users
-- ============================================================

CREATE TABLE IF NOT EXISTS Users (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserName TEXT,
    Mobile TEXT,
    DOB TEXT,
    EMail TEXT,
    LoginID TEXT,
    Password BLOB,
    UserRole TEXT,
    UserLocation INTEGER,
    ClientID INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- VMValue
-- ============================================================

CREATE TABLE IF NOT EXISTS VMValue (
    VMID INTEGER PRIMARY KEY,
    ValuedOn TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- WaterConnections
-- ============================================================

CREATE TABLE IF NOT EXISTS WaterConnections (
    ACID INTEGER,
    Owner_Name TEXT,
    Pipe_Size TEXT,
    size_value INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- Weightages
-- ============================================================

CREATE TABLE IF NOT EXISTS Weightages (
    ZID INTEGER,
    PTID INTEGER,
    Weightage REAL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- Zones
-- ============================================================

CREATE TABLE IF NOT EXISTS Zones (
    ZID INTEGER PRIMARY KEY AUTOINCREMENT,
    ZoneName TEXT,
    PointsPer REAL DEFAULT 0.0,
    ClientID INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1
);


-- ============================================================
-- Talukas
-- ============================================================

CREATE TABLE IF NOT EXISTS Talukas (
    TalukaID INTEGER PRIMARY KEY AUTOINCREMENT,
    TalukaName TEXT,
    DistID INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1,

    FOREIGN KEY (DistID)
        REFERENCES Districts(DistID)
);


-- ============================================================
-- TaxDemandDetails
-- ============================================================

CREATE TABLE IF NOT EXISTS TaxDemandDetails (
    DID INTEGER,
    TaxID INTEGER,
    PreviousBalance REAL,
    CurrentBalance REAL,
    TotalBalance REAL,
    LedgerID INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1,

    FOREIGN KEY (DID)
        REFERENCES TaxDemands(DID)
        ON DELETE CASCADE
);


-- ============================================================
-- TransactionDetails
-- ============================================================

CREATE TABLE IF NOT EXISTS TransactionDetails (
    TranID INTEGER,
    SN INTEGER,
    LedgerID1 INTEGER,
    LedgerID2 INTEGER,
    Debit REAL,
    Credit REAL,
    DrCr TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    sync_version INTEGER DEFAULT 1,

    FOREIGN KEY (TranID)
        REFERENCES Transactions(TranID)
        ON DELETE CASCADE
);


-- ============================================================
-- SyncState (local sync bookkeeping)
-- ============================================================

CREATE TABLE IF NOT EXISTS sync_state (
    table_name TEXT NOT NULL,
    record_key TEXT NOT NULL,
    synced_version INTEGER NOT NULL,
    synced_at TEXT NOT NULL,
    PRIMARY KEY (table_name, record_key)
);


`;

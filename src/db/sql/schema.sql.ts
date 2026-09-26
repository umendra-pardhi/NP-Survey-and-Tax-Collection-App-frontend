export const DB_SCHEMA_SQL = `
PRAGMA journal_mode = WAL;

PRAGMA foreign_keys = ON;

-- =========================================================
-- accounts
-- =========================================================

CREATE TABLE IF NOT EXISTS accounts (
    acid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    clientid INTEGER NULL,
    ledgerid INTEGER NULL,
    zid INTEGER NULL,
    wardno INTEGER NULL,
    propertyno INTEGER NULL,
    partno INTEGER NULL,
    citysurveyno VARCHAR(50) NULL,
    plotno VARCHAR(50) NULL,
    o_onlineno VARCHAR(50) NULL,
    o_zid INTEGER NULL,
    o_wardno INTEGER NULL,
    o_propertyno VARCHAR(50) NULL,
    o_partno VARCHAR(50) NULL,
    o_citysurveyno VARCHAR(50) NULL,
    o_plotno VARCHAR(50) NULL,
    o_usage VARCHAR(50) NULL,
    o_taxablevalue REAL NULL,
    o_anualrentalvalue REAL NULL,
    aadhar_no VARCHAR(12) NULL,
    "CTID" INTEGER NULL,
    puid INTEGER NULL,
    o_totaltax NUMERIC(18,2) NULL,
    owner_name VARCHAR(500) NULL,
    holder_name VARCHAR(100) NULL,
    wife_name VARCHAR(100) NULL,
    buildingname VARCHAR(50) NULL,
    buildingno VARCHAR(50) NULL,
    address VARCHAR(150) NULL,
    mobileno VARCHAR(50) NULL,
    exchange VARCHAR(100) NULL,
    hastoilet BOOLEAN NULL,
    toiletseats1 INTEGER NULL,
    toiletseats2 INTEGER NULL,
    haswaterconnection BOOLEAN NULL,
    totalwaterconnections INTEGER NULL,
    hassolarelectricity BOOLEAN NULL,
    hasrainwaterharvesting BOOLEAN NULL,
    hastree BOOLEAN NULL,
    boundry_east VARCHAR(50) NULL,
    boundry_west VARCHAR(50) NULL,
    boundry_north VARCHAR(50) NULL,
    boundry_south VARCHAR(50) NULL,
    lengthoneast REAL NULL,
    lengthonwest REAL NULL,
    lengthonnorth REAL NULL,
    lengthonsouth REAL NULL,
    avg_length REAL NULL,
    avg_breadth REAL NULL,
    area REAL NULL,
    opa REAL NULL,
    gharkul BOOLEAN DEFAULT 0 NULL,
    hasgharkul BOOLEAN DEFAULT 0 NULL,
    treenos INTEGER DEFAULT 0 NULL,
    hastenant BOOLEAN DEFAULT 0 NULL,
    hasbore BOOLEAN DEFAULT 0 NULL,
    haswell BOOLEAN DEFAULT 0 NULL,
    tenantname VARCHAR(100) NULL,
    photopath TEXT NULL,
    mappath TEXT NULL,
    "Length" REAL DEFAULT 0 NULL,
    breadth REAL DEFAULT 0 NULL,
    asmcomplete BOOLEAN DEFAULT 0 NOT NULL,
    oldbuiltuparea REAL DEFAULT 0 NULL,
    remark1 TEXT NULL,
    remark2 TEXT NULL,
    hastower BOOLEAN DEFAULT 0 NULL,
    manualratablevalue BOOLEAN DEFAULT 0 NULL,
    manualtax BOOLEAN DEFAULT 0 NULL,
    remarks3 TEXT NULL,
    numberingremarks TEXT NULL,
    numberingdone BOOLEAN NULL,
    surveydone BOOLEAN NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS assessedtax (
    acid INTEGER NULL,
    taxid INTEGER NULL,
    amount REAL NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS assessedtaxcapital (
    acid INTEGER NULL,
    taxid INTEGER NULL,
    amount REAL NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS assessedtaxcapitaldetails (
    acid INTEGER NULL,
    propertydescription VARCHAR(50) NULL,
    pdid INTEGER NULL,
    taxid INTEGER NULL,
    amount INTEGER DEFAULT 0 NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS assessedtaxrent (
    acid INTEGER NULL,
    taxid INTEGER NULL,
    amount REAL NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS assessedtaxrentdetails (
    acid INTEGER NULL,
    propertydescription VARCHAR(50) NULL,
    pdid INTEGER NULL,
    taxid INTEGER NULL,
    amount INTEGER DEFAULT 0 NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS assessment (
    asid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    acid INTEGER NULL,
    propertydescription VARCHAR(50) NULL,
    floor VARCHAR(10) NULL,
    con_year INTEGER NULL,
    con_type VARCHAR(50) NULL,
    prop_use VARCHAR(50) NULL,
    areaft REAL NULL,
    areamt REAL NULL,
    ratesqmt REAL NULL,
    monthly_rent REAL NULL,
    annual_rent REAL NULL,
    annual_tax_value REAL NULL,
    dep_per REAL NULL,
    dep_amt REAL NULL,
    gap REAL NULL,
    ff REAL NULL,
    weightage REAL NULL,
    taxable_amt REAL NULL,
    zone_point REAL NULL,
    pdid INTEGER NULL,
    "CTID" INTEGER NULL,
    puid INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS assessmentcapital (
    acid INTEGER NULL,
    propertydescription VARCHAR(50) NULL,
    floor VARCHAR(10) NULL,
    con_year INTEGER NULL,
    ass_year INTEGER NULL,
    con_type VARCHAR(50) NULL,
    prop_use VARCHAR(50) NULL,
    areaft REAL NULL,
    areamt REAL NULL,
    ratesqmt REAL NULL,
    monthly_rent REAL NULL,
    annual_rent REAL NULL,
    annual_tax_value REAL NULL,
    dep_per REAL NULL,
    dep_amt REAL NULL,
    gap REAL NULL,
    ff REAL NULL,
    weightage REAL NULL,
    taxable_amt REAL NULL,
    zone_point REAL NULL,
    pdid INTEGER NULL,
    "CTID" INTEGER NULL,
    puid INTEGER NULL,
    rep_per REAL DEFAULT 0 NULL,
    rep_amt INTEGER DEFAULT 0 NULL,
    manualratablevalue BOOLEAN DEFAULT 0 NULL,
    srnid INTEGER DEFAULT 0 NULL,
    buildingno VARCHAR(10) NULL,
    holder VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS assessmentrent (
    acid INTEGER NULL,
    propertydescription VARCHAR(50) NULL,
    floor VARCHAR(10) NULL,
    con_year INTEGER NULL,
    ass_year INTEGER NULL,
    con_type VARCHAR(50) NULL,
    prop_use VARCHAR(50) NULL,
    areaft REAL NULL,
    areamt REAL NULL,
    ratesqmt REAL NULL,
    monthly_rent REAL NULL,
    annual_rent REAL NULL,
    annual_tax_value REAL NULL,
    dep_per REAL NULL,
    dep_amt REAL NULL,
    gap REAL NULL,
    ff REAL NULL,
    weightage REAL NULL,
    taxable_amt REAL NULL,
    zone_point REAL NULL,
    pdid INTEGER NULL,
    "CTID" INTEGER NULL,
    puid INTEGER NULL,
    srno INTEGER NULL,
    srnid INTEGER NULL,
    rep_per REAL DEFAULT 0 NULL,
    rep_amt INTEGER DEFAULT 0 NULL,
    manualratablevalue BOOLEAN DEFAULT 0 NULL,
    buildingno VARCHAR(10) NULL,
    holder VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS capital_deprateonct (
    depid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    clientid INTEGER NULL,
    minyear INTEGER NULL,
    maxyear INTEGER NULL,
    "CTID" INTEGER NULL,
    zid INTEGER NULL,
    per REAL NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS carpetareas (
    acid INTEGER NULL,
    propid INTEGER NULL,
    carid INTEGER NULL,
    "Length" REAL NULL,
    breadth REAL NULL,
    area REAL NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS clients (
    clientid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    clientname VARCHAR(255) NULL,
    clienttype VARCHAR(100) NULL,
    talukaid INTEGER NULL,
    distid INTEGER NULL,
    stateid INTEGER NULL,
    pincode CHAR(6) NULL,
    mobileno VARCHAR(50) NULL,
    phoneno VARCHAR(50) NULL,
    remarks VARCHAR(50) NULL,
    changebuildarea BOOLEAN NULL,
    askboundry BOOLEAN NULL,
    valuationmethod INTEGER NULL,
    taxvaluebyamtorper BOOLEAN NULL,
    start_year INTEGER NULL,
    end_year INTEGER NULL,
    sign1auth VARCHAR(50) NULL,
    sign2auth VARCHAR(50) NULL,
    sign3auth VARCHAR(50) NULL,
    sign1 BLOB NULL,
    sign2 BLOB NULL,
    sign3 BLOB NULL,
    logo BLOB NULL,
    separatewatertax BOOLEAN DEFAULT 0 NULL,
    taxonarea INTEGER DEFAULT 0 NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS constructiontypes (
    "CTID" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    constructiontype VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS defaultledgers (
    dlid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    ledgeridentity VARCHAR(50) NULL,
    ledgerid INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS demandtemplate (
    tempid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    orderno INTEGER DEFAULT 0 NULL,
    taxid INTEGER DEFAULT 0 NULL,
    ledgerid INTEGER DEFAULT 0 NULL,
    itemtype VARCHAR(50) NULL,
    heading VARCHAR(50) NULL,
    "Attribute" VARCHAR(50) NULL,
    "Range" VARCHAR(50) NULL,
    expression VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS districts (
    distid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    districtname VARCHAR(100) NULL,
    stateid INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS edutaxrates (
    rangefrom INTEGER NULL,
    rangeto INTEGER NULL,
    per1 REAL NULL,
    per2 REAL NULL,
    taxid INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS emptaxrates (
    rangefrom INTEGER NULL,
    rangeto INTEGER NULL,
    per REAL NULL,
    taxid INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS financialyears (
    fyid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    yearfrom INTEGER NULL,
    yearto INTEGER NULL,
    selected BOOLEAN NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS floorfactor (
    flrid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    clientid INTEGER NULL,
    zid INTEGER NULL,
    floor VARCHAR(10) NULL,
    factor REAL NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS lgis (
    lgiid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    institutetypename VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS ledgertypes (
    ltid INTEGER NULL,
    ledgertype VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS ledgers (
    ledgerid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    ledgername TEXT NULL,
    ledgertype INTEGER NULL,
    clientid INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS photosmaps (
    clientid INTEGER NULL,
    acid INTEGER NOT NULL,
    photo BLOB NULL,
    "Map" BLOB NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS propertydesc (
    pdid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    propertydescription VARCHAR(50) NULL,
    weightage REAL DEFAULT 0.0 NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS propertyusage (
    puid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    propertyuse VARCHAR(50) NULL,
    pdid INTEGER NULL,
    taxamount INTEGER DEFAULT 0 NULL,
    gwtax INTEGER DEFAULT 0 NULL,
    swtax INTEGER DEFAULT 0 NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS propertyusageold (
    puid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    propertyuse VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS recount (
    rid INTEGER NULL,
    rtype VARCHAR(50) NULL,
    fyid INTEGER NULL,
    recno INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS rateonctzonewise_capital (
    ctzrid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    clientid INTEGER NULL,
    zid INTEGER NULL,
    "CTID" INTEGER NULL,
    rate INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS rateonctzonewise_rent (
    ctzrid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    clientid INTEGER NULL,
    zid INTEGER NULL,
    "CTID" INTEGER NULL,
    rate INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS receipttemplate (
    tempid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    orderno INTEGER DEFAULT 0 NULL,
    taxid INTEGER DEFAULT 0 NULL,
    ledgerid INTEGER DEFAULT 0 NULL,
    itemtype VARCHAR(50) NULL,
    heading VARCHAR(50) NULL,
    "Attribute" VARCHAR(50) NULL,
    "Range" VARCHAR(50) NULL,
    expression VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS rent_deprateonct (
    depid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    clientid INTEGER NULL,
    minyear INTEGER NULL,
    maxyear INTEGER NULL,
    "CTID" INTEGER NULL,
    per REAL NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS rent_repairingrateonct (
    repid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    clientid INTEGER NULL,
    minyear INTEGER NULL,
    maxyear INTEGER NULL,
    "CTID" INTEGER NULL,
    per REAL NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS settings (
    settingname VARCHAR(50) NULL,
    stringvalue VARCHAR(50) NULL,
    integervalue INTEGER NULL,
    floatvalue REAL NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS states (
    stateid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    statename VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS taxdemandpaymentdetails (
    did INTEGER NULL,
    taxid INTEGER NULL,
    previousbalance INTEGER DEFAULT 0 NULL,
    currentbalance INTEGER DEFAULT 0 NULL,
    previouspaid INTEGER DEFAULT 0 NULL,
    currentpaid INTEGER DEFAULT 0 NULL,
    rempreviousbalance INTEGER DEFAULT 0 NULL,
    remcurrentbalance INTEGER DEFAULT 0 NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS taxdemands (
    did INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    recno INTEGER NOT NULL,
    acid INTEGER NULL,
    ddate DATE NULL,
    fyid INTEGER NULL,
    sumprevious INTEGER NULL,
    sumnew INTEGER NULL,
    sumtotal INTEGER NULL,
    exadjustment INTEGER NULL,
    advance INTEGER NULL,
    adjustment INTEGER NULL,
    discount INTEGER NULL,
    totalpayableamt INTEGER NULL,
    inwords VARCHAR(100) NULL,
    dpaid INTEGER NULL,
    tranid INTEGER NULL,
    watertax REAL NULL,
    maindemand BOOLEAN DEFAULT 0 NOT NULL,
    locked BOOLEAN DEFAULT 0 NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS taxpaymentdetails (
    pyid INTEGER NULL,
    did INTEGER NULL,
    taxid INTEGER NULL,
    ledgerid INTEGER NULL,
    balancepaid REAL NULL,
    currentpaid REAL NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS taxpayments (
    pyid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    did INTEGER NULL,
    recno INTEGER NULL,
    acid INTEGER NULL,
    ddate TIMESTAMP NULL,
    fyid INTEGER NULL,
    sumprevious REAL NULL,
    sumcurrent REAL NULL,
    exadjustment REAL NULL,
    advance REAL NULL,
    discount REAL NULL,
    cashdiscount REAL NULL,
    balanceamt REAL NULL,
    excessamt REAL NULL,
    watertax REAL NULL,
    totalbillamt REAL NULL,
    totalpayableamt REAL NULL,
    amountpaid REAL NULL,
    inwords VARCHAR(100) NULL,
    paymentmode VARCHAR(50) NULL,
    instrumentno VARCHAR(50) NULL,
    instrumentdate DATE NULL,
    bankname VARCHAR(50) NULL,
    receiver VARCHAR(50) NULL,
    receivedfrom VARCHAR(50) NULL,
    tranid INTEGER NULL,
    penalty REAL NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS taxrates (
    minarea INTEGER NULL,
    maxarea INTEGER NULL,
    amount REAL NULL,
    per REAL NULL,
    tsrate1 INTEGER DEFAULT 0 NULL,
    tsrate2 INTEGER DEFAULT 0 NULL,
    taxid INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS taxtypes (
    taxid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    taxtype VARCHAR(50) NULL,
    taxoverttoiletseat BOOLEAN DEFAULT 0 NULL,
    taxonwaterconnection BOOLEAN NULL,
    taxonwholeproperty BOOLEAN NULL,
    educationtax BOOLEAN NULL,
    employmenttax BOOLEAN NULL,
    usagetax BOOLEAN DEFAULT 0 NULL,
    propertytax BOOLEAN DEFAULT 0 NULL,
    firesafetytax BOOLEAN DEFAULT 0 NULL,
    advttax BOOLEAN DEFAULT 0 NULL,
    specialtax BOOLEAN DEFAULT 0 NULL,
    ordno INTEGER NULL,
    fix BOOLEAN NULL,
    valuedon INTEGER NULL,
    ledgerid INTEGER NULL,
    oldtax BOOLEAN DEFAULT 0 NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS taxprodeal (
    pdid INTEGER NULL,
    taxid INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS towertaxper (
    id INTEGER NULL,
    towerper INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS transactions (
    tranid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    fyid INTEGER NULL,
    trandate TIMESTAMP NULL,
    vouchertype INTEGER NULL,
    voucherno INTEGER NULL,
    trandetails VARCHAR(100) NULL,
    remarks VARCHAR(100) NULL,
    amount REAL NULL,
    userid INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS usagelog (
    logid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    logtype VARCHAR(50) NULL,
    description TEXT NULL,
    logdate TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS users (
    userid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username VARCHAR(50) NULL,
    mobile VARCHAR(50) NULL,
    dob DATE NULL,
    email VARCHAR(50) NULL,
    loginid VARCHAR(50) NULL,
    "Password" VARCHAR(255) NULL,
    userrole VARCHAR(50) NULL,
    userlocation BOOLEAN NULL,
    clientid INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS vmvalue (
    vmid INTEGER PRIMARY KEY NOT NULL,
    valuedon VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS waterconnections (
    acid INTEGER NULL,
    owner_name VARCHAR(50) NULL,
    pipe_size VARCHAR(50) NULL,
    size_value INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS weightages (
    zid INTEGER NULL,
    ptid INTEGER NULL,
    weightage REAL NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS zones (
    zid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    zonename VARCHAR(100) NULL,
    pointsper REAL DEFAULT 0.0 NULL,
    clientid INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS accountsphotos (
    imageid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    acid INTEGER NOT NULL,
    filename VARCHAR(255) NULL,
    mimetype VARCHAR(50) NULL,
    imagepath VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL,
    CONSTRAINT FK__AccountsPh__ACID__5B438874
        FOREIGN KEY (acid)
        REFERENCES accounts(acid)
);

CREATE TABLE IF NOT EXISTS sync_state (
    table_name VARCHAR(100) NOT NULL,
    record_key VARCHAR(100) NOT NULL,
    synced_version INTEGER NOT NULL DEFAULT 0,
    synced_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (table_name, record_key)
);

CREATE TABLE IF NOT EXISTS talukas (
    talukaid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    talukaname VARCHAR(100) NULL,
    distid INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL,
    CONSTRAINT FK_Talukas_Districts
        FOREIGN KEY (distid)
        REFERENCES districts(distid)
);

CREATE TABLE IF NOT EXISTS taxdemanddetails (
    did INTEGER NULL,
    taxid INTEGER NULL,
    previousbalance REAL NULL,
    currentbalance REAL NULL,
    totalbalance REAL NULL,
    ledgerid INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL,
    CONSTRAINT FK_TaxDemandDetails_TaxDemands
        FOREIGN KEY (did)
        REFERENCES taxdemands(did)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactiondetails (
    tranid INTEGER NULL,
    sn INTEGER NULL,
    ledgerid1 INTEGER NULL,
    ledgerid2 INTEGER NULL,
    debit NUMERIC(12,2) NULL,
    credit NUMERIC(12,2) NULL,
    drcr CHAR(2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    sync_version INTEGER DEFAULT 1 NULL,
    CONSTRAINT FK_TransactionDetails_Transactions
        FOREIGN KEY (tranid)
        REFERENCES transactions(tranid)
        ON DELETE CASCADE
);

`;

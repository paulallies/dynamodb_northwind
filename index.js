const { Client } = require("pg");
const ULID = require("ulid");
const client = new Client({
  password: "h1FNFvsADEYtAhbgU6e__i-3rRnwd6WQ",
  user: "cvroglml",
  host: "tai.db.elephantsql.com",
  port: "5432",
  database: "cvroglml",
});
const { writeBatch, deleteBatch, getItems, createGSI } = require("./dynamodb");

function addPrimaryKey(coll) {
  const result = coll.map((item) => {
    const id = ULID.ulid();
    return {
      PK: `SUPPLIER#${id}`,
      SK: `SUPPLIER#${id}`,
      ...item,
    };
  });

  return result;
}

async function listSuppliers() {
  const res = await client.query(`SELECT * from  suppliers`);
  return res.rows;
}

async function migrateSuppliers() {
  const suppliers = await listSuppliers();
  const items = addPrimaryKey(suppliers);
  await writeBatch(items);
  console.log("Suppliers Migrated Successfully");
}

async function deleteSuppliers() {
  const items = await getItems({ gsi: "GSI_1", PK: "PK1" });
  await deleteBatch(items);
}

async function createGSI_1() {
  await createGSI({
    table: "NORTHWIND",
    name: "GSI_1",
    PK: "PK1",
    SK: "SK1",
  });
}

(async () => {
  try {
    await client.connect();
    await migrateSuppliers();
    process.exit();
  } finally {
    await client.end();
    process.exit();
  }
})();

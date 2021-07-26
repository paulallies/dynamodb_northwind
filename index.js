require("dotenv").config({ path: "./.env" })

const { writeBatch, deleteBatch, ddbQuery, createGSI, ddbCreateTypeCollectionItems } = require("./dynamodb_utils");
const { listPgTables, pgQuery } = require("./pg_utils");
const { print } = require("./utils")

async function migrateDataTables({ pg_table, type, sort_key_prop }) {
  const data = await pgQuery(`select * from ${pg_table}`);
  const items = ddbCreateTypeCollectionItems({ data, type, sort_key_prop });
  await writeBatch(items);
  print(`${pg_table} migrated`)
}




async function deleteCollection(name) {
  const type = name.toUpperCase();
  const items = await ddbQuery({ index: 'GSI_TYPE', PK: "PK_TYPE", PKValue: type });
  await deleteBatch(items);
  console.log(`Collection ${type} deleted!`)

}

async function migrateCollections() {

  await migrateDataTables({
    pg_table: "suppliers",
    type: "SUPPLIER",
    sort_key_prop: "company_name"
  })

  await migrateDataTables({
    pg_table: "customers",
    type: "CUSTOMER",
    sort_key_prop: "company_name"
  })
}

async function createTypeGSI() {
  await createGSI({ name: "GSI_TYPE", PK: "PK_TYPE", SK: "SK_TYPE" })
}



(async () => {
  try {

  }
  catch (err) {
    console.error(err.message)
  } finally {
    process.exit();
  }
})();

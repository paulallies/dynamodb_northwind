const { Client } = require("pg");


exports.pgQuery = async (query) => {
  const client = new Client({
    password: process.env.PG_PASSWORD,
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
  });
  await client.connect();
  const res = await client.query(query);
  await client.end();
  return res.rows;

}

exports.listPgTables = async () => {
  const client = new Client({
    password: process.env.PG_PASSWORD,
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
  });
  await client.connect();
  const res = await client.query(`SELECT tablename  FROM pg_catalog.pg_tables  WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';`);
  await client.end();
  return res.rows;
}
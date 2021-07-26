var express = require('express')
var router = express.Router()
var { listPgTables, pgQuery } = require("../pg_utils")

router.get('/tables', async (req, res) => {
    const data = await listPgTables();
    res.json(data)
})

router.get('/tables/:table', async (req, res) => {
    const table = req.params.table;
    const data = await pgQuery(`select * from ${table}`);
    res.json(data)
})

router.get('/tables/:table/info', async (req, res) => {
    const table = req.params.table;
    const data = await pgQuery(`
    SELECT 
        column_name, 
        data_type 
    FROM 
        information_schema.columns
    WHERE 
        table_name = '${table}';
    `);
    res.json(data)
})

module.exports = router
const conn = require('./db');

async function validateUnique(tableColumnJson, ignoreId=0)
{
    const table = tableColumnJson.table;
    const column = tableColumnJson.column;
    const value = tableColumnJson.value;
   
    const fetchPrimaryKey = await conn.query(
        `SELECT a.attname as primary_key
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = $1::regclass AND i.indisprimary;`,
        [table]
    );

    primaryKey = fetchPrimaryKey.rows[0].primary_key;

    const fetchDuplicateRowsCount = await conn.query(
        `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = $1 AND ${primaryKey} != $2`,
        [value, ignoreId]
    );
    
    const duplicateRowsCount = parseInt(fetchDuplicateRowsCount.rows[0].count);

    if (duplicateRowsCount> 0) 
    {
        // If there are other duplicate rows, then the row is not unique
        return false;
    } 
    else {
        return true;
    }
}

module.exports = {
    validateUnique: validateUnique
}
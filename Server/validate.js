const conn = require('./db');

async function validate(rules)
{
    let isPassed = true;
    const test = [];
    Object.keys(rules).forEach(fieldName => {
        let errors = {};
        const rule = rules[fieldName];

        if (!validateRequired(rule.required)) {
            errors[fieldName] = `${rule.fieldName} is required`;
            test.push(errors);
        }
    });


    return test;
}

function validateRequired(value) 
{
    if (value == "") {
        return false;
    }
    else {
        return true;
    }
}

async function validateUnique(data)
{
    const table = data.table;
    const column = data.column;
    const value = data.value;
    let fetchDuplicateRowsCount;
    const ignoreId = data.ignoreId ?? null;
   
    if (ignoreId) {
        const fetchPrimaryKey = await conn.query(
            `SELECT a.attname as primary_key
            FROM pg_index i
            JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
            WHERE i.indrelid = $1::regclass AND i.indisprimary;`,
            [table]
        );
        primaryKey = fetchPrimaryKey.rows[0].primary_key;

        fetchDuplicateRowsCount = await conn.query(
            `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = $1 AND ${primaryKey} != $2`,
            [value, ignoreId]
        );
    }
    else
    {
        fetchDuplicateRowsCount = await conn.query(
            `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = $1`,
            [value]
        );
    }
    
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
    validateUnique: validateUnique,
    validate: validate
}
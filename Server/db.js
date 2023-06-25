const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: '456champ',
    host: 'localhost',
    port: 5432,
    database: 'crm'
});

module.exports = pool;

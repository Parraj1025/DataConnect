const { Pool }= require('pg');
const pool = new Pool({
    host: 'localhost',
    database: 'TESTING',
    user: 'postgres',
    password: '1560',
    port: 5432,
    ssl: false
})

module.exports = pool

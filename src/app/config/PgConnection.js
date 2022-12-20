const {Client, Pool} = require('pg')

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "2206dialybachieu",
    database: "QLBDS"
})


module.exports = pool
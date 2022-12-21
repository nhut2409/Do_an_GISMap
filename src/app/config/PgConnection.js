const {Client} = require('pg')

const pgClient = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "2206dialybachieu",
    database: "QLBDS"
})


module.exports = pgClient
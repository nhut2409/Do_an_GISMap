const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "2206dialybachieu",
    database: "QLBDS"
})


module.exports = client
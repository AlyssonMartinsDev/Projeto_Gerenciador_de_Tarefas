const sqlite3 = require('sqlite3').verbose();


const dbConn = new sqlite3.Database('./database/database.db', (err) => {
    if (err) {
        console.error("Erro ao abrir o banco de dados: " + err.message)

    } else {
        console.log("Conectado ao banco de dados.")
    }
})

dbConn.serialize(() => {
    dbConn.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            completed BOOLEAN DEFAULT 0
        )
    `);
    dbConn.run(`
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `)
})


module.exports = dbConn;
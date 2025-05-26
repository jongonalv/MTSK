require('dotenv').config();
const mysql = require("mysql");

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        console.error('Error de conexión con la base de datos: ', err);
        process.exit(1);
    }
    console.log('Conexión realizada correctamente.');
});

module.exports = db;
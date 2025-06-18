require('dotenv').config();
const sql = require('mssql');

// Configuración de la conexión
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Conectar y exportar el pool
const poolPromise = sql.connect(config)
    .then(pool => {
        console.log("Conexión a SQL Server establecida.");
        return pool;
    })
    .catch(err => {
        console.error("Error de conexión a SQL Server:", err);
        process.exit(1);
    });

module.exports = {
    sql,
    poolPromise
};

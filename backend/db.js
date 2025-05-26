const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'mtsk_version1',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Error de conexión con la base de datos: ', err);
        process.exit(1);
    }
    console.log('Conexión realizada correctamente.');
});

module.exports = db;

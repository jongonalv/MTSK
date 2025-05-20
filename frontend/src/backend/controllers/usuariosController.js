const db = require('../config/database');

exports.getUsuarios = (req, res) => {
    const sqlQuery = 'SELECT Usuario, Nombre FROM usuario';
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error al obtener la lista de usuarios: ', err);
            res.status(500).send('Error al obtener la lista de usuarios');
            return;
        }
        res.json(result);
    });
};
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

// Importar rutas
const equiposRoutes = require('./routes/equiposRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const movimientosRoutes = require('./routes/movimientosRoutes');
const etiquetasRoutes = require('./routes/etiquetasRoutes');

// Crear la aplicación express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error de conexión con la base de datos: ', err);
        process.exit(1);
    }
    console.log('Conexión realizada correctamente.');
});

// Rutas
app.use('/equipos', equiposRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/movimientos', movimientosRoutes);
app.use('/etiquetas', etiquetasRoutes);

// Manejador de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

module.exports = app;
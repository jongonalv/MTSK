const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/equipos', require('./routes/equipos'));
app.use('/usuarios', require('./routes/usuarios'));
app.use('/movimientos', require('./routes/movimientos'));
app.use('/siguienteEtiqueta', require('./routes/etiquetas'));

// Servidor
app.listen(3001, () => {
    console.debug('Servidor corriendo en el puerto 3001');
});

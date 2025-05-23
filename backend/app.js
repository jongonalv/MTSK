const express = require("express");
const cors = require("cors");
const db = require("./db");
const equiposRoutes = require("./routes/equipos");
const usuariosRoutes = require("./routes/usuarios");
const movimientosRoutes = require("./routes/movimientos");
const asignarRoutes = require("./routes/asignar");
const agregarEquipoRoutes = require("./routes/agregarEquipo");
const updateEquipoRoutes = require("./routes/updateEquipo");
const updateProductoRoutes = require("./routes/updateProducto");
const eliminarEquipoRoutes = require("./routes/eliminarEquipo");
const siguienteEtiquetaRoutes = require("./routes/siguienteEtiqueta");

const app = express();
app.use(cors());
app.use(express.json());

app.use(equiposRoutes);
app.use(usuariosRoutes);
app.use(movimientosRoutes);
app.use(asignarRoutes);
app.use(agregarEquipoRoutes);
app.use(updateEquipoRoutes);
app.use(updateProductoRoutes);
app.use(eliminarEquipoRoutes);
app.use(siguienteEtiquetaRoutes);

app.listen(3001, () => {
    console.debug('Servidor corriendo en el puerto 3001');
});
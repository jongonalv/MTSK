const express = require("express");
const cors = require("cors");
const config = require("./config");
const db = require("./db");

const equiposRoutes = require("./routes/equipos");
const usuariosRoutes = require("./routes/usuarios");
const agregarUsuariosRoutes = require("./routes/agregarUsuario");
const movimientosRoutes = require("./routes/movimientos");
const asignarRoutes = require("./routes/asignar");
const agregarEquipoRoutes = require("./routes/agregarEquipo");
const updateEquipoRoutes = require("./routes/updateEquipo");
const updateProductoRoutes = require("./routes/updateProducto");
const eliminarEquipoRoutes = require("./routes/eliminarEquipo");
const siguienteEtiquetaRoutes = require("./routes/siguienteEtiqueta");
const accesoriosRoutes = require("./routes/accesorios");
const alertasRoutes = require("./routes/alertas");
const equiposSinAsignarRoutes = require("./routes/equiposSinAsignar");
const reporteEquiposRouter = require("./routes/reporte-equipos");

const app = express();

// aplicar al CORS la configuracion
app.use(cors(
  config.application.cors.server
));

// Middlewares
app.use(express.json());

// Rutas
app.use('/api', equiposRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', movimientosRoutes);
app.use('/api', asignarRoutes);
app.use('/api', agregarEquipoRoutes);
app.use('/api', updateEquipoRoutes);
app.use('/api', updateProductoRoutes);
app.use('/api', eliminarEquipoRoutes);
app.use('/api', siguienteEtiquetaRoutes);
app.use('/api', agregarUsuariosRoutes);
app.use('/api', accesoriosRoutes);
app.use('/api', alertasRoutes);
app.use('/api', equiposSinAsignarRoutes);
app.use('/api', reporteEquiposRouter);

// Logger
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.originalUrl}`);
  next();
});

// Ruta de prueba
app.get('/api/prueba', (req, res) => {
  res.send('✅ Funciona correctamente');
});

// Arranque del servidor
const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Express corriendo en http://0.0.0.0:${PORT}`);
});

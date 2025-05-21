const express = require("express");
const cors = require("cors");
const equiposRoutes = require("./routes/equipos");
const usuariosRoutes = require("./routes/usuarios");
const movimientosRoutes = require("./routes/movimientos");
const etiquetasRoutes = require("./routes/etiquetas");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/equipo", equiposRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/movimientos", movimientosRoutes);
app.use("/", etiquetasRoutes); // para /siguienteEtiqueta

const PORT = 3001;
app.listen(PORT, () => {
  console.debug(`Servidor corriendo en el puerto ${PORT}`);
});

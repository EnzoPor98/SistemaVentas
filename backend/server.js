const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Configurar variables de entorno
dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); // Permite al servidor recibir datos en formato JSON

// Rutas de la aplicación
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/sales", require("./routes/saleRoutes"));

// Ruta de prueba inicial
app.get("/", (req, res) => {
  res.send("PERMISO CONCEDIDO: ACCESO TOTAL AL DISPOSITIVO.");
});

// Conexión a MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conexión exitosa a MongoDB");
    // Iniciar el servidor solo si la base de datos se conecta correctamente
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar a MongoDB:", error.message);
  });

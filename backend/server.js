const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require('path');
const expressJSDocSwagger = require("express-jsdoc-swagger");

// Configurar variables de entorno
dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); // Permite al servidor recibir datos en formato JSON

// Configuracion swagger
const swaggerOptions = {
  info: {
    version: "1.0.0",
    title: "Sistema de Ventas API",
    description: "API del sistema de inventario y ventas",
  },
  // Apunta a tus archivos de rutas
  filesPattern: path.join(__dirname, './routes/*.js'),
  // La URL donde se abrirá la documentación
  swaggerUIPath: "/api-docs",
  // Activamos esto para que nos exponga la UI de Swagger de forma amigable
  exposeSwaggerUI: true,
};

// Inicializa Swagger pasándole tu app de Express
expressJSDocSwagger(app)(swaggerOptions);

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

/*
  USER TOKEN: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNGIzMzlkMTA1N2QzMWQxMjljZDc5NCIsImlhdCI6MTc4MzkxNTY4NSwiZXhwIjoxNzg2NTA3Njg1fQ.MirD1rgy2SDFSH0FK9w3Er1NvL6VPKkNnupqdcXehRM
  */

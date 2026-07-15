const express = require("express");
const router = express.Router();
const {
  createSale,
  getSales,
  getDashboardStats,
} = require("../controllers/saleController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

// Proteger todas las rutas de este archivo
router.use(protect);

// Ruta exclusiva de Administración
router.get("/dashboard", authorize("admin"), getDashboardStats);

// Rutas generales de ventas
router.route("/").get(getSales).post(createSale);

module.exports = router;

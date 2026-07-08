const express = require("express");
const router = express.Router();
const { createSale, getSales } = require("../controllers/saleController");
const { protect } = require("../middlewares/authMiddleware");

// Proteger todas las rutas de este archivo
router.use(protect);

router.route("/").get(getSales).post(createSale);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");
const { protect } = require("../middlewares/authMiddleware");

// Aplicar el middleware de protección a TODAS las rutas de este archivo
router.use(protect);

// Rutas para /api/clients
router.route("/").get(getClients).post(createClient);

// Rutas para /api/clients/:id
router.route("/:id").get(getClientById).put(updateClient).delete(deleteClient);

module.exports = router;

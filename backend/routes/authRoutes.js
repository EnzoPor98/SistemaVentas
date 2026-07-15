const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// Definir las rutas y conectarlas al controlador
router.post("/register", registerUser);

/**
 * POST /api/auth/login
 * @summary Iniciar sesión de usuario
 * @tags Autenticación
 * @param {object} request.body.required - Credenciales de acceso - application/json
 * @return {object} 200 - Login exitoso, devuelve el token
 * @return {object} 400 - Credenciales incorrectas
 */
router.post('/login', loginUser);

module.exports = router;

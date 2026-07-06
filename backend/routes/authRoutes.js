const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Definir las rutas y conectarlas al controlador
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
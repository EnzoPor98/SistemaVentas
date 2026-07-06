const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Función auxiliar para generar el Token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // El token expirará en 30 días
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "El usuario ya existe con ese correo" });
    }

    // 2. Crear el nuevo usuario (el hook en el modelo encriptará la contraseña)
    const user = await User.create({ name, email, password, role });

    // 3. Responder con los datos del usuario y su token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// @desc    Iniciar sesión (Login)
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Credenciales inválidas (Correo no encontrado)" });
    }

    // 2. Verificar si la contraseña coincide utilizando el método del modelo
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Credenciales inválidas (Contraseña incorrecta)" });
    }

    // 3. Si todo está bien, retornar datos y su token correspondiente
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

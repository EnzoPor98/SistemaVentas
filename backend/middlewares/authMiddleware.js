const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Verificar si el token viene en los encabezados (Headers) de la petición
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extraer el token del texto "Bearer XXXXXXX"
      token = req.headers.authorization.split(" ")[1];

      // Decodificar y verificar el token con la firma secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar al usuario en la BD (sin traer la contraseña) y añadirlo a la petición (req.user)
      req.user = await User.findById(decoded.id).select("-password");

      // Dar luz verde para pasar a la siguiente función/controlador
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "No autorizado, token fallido o expirado" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "No autorizado, no se proporcionó ningún token" });
  }
};

module.exports = { protect };

// Middleware para restringir acceso por roles
const authorize = (...rolesPermitidos) => {
  return (req, res, next) => {
    // req.user ya fue cargado previamente por el middleware 'protect'
    if (!req.user || !rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({
        message: `Acceso denegado. Tu rol (${req.user?.role || "Ninguno"}) no tiene permisos para esta acción.`,
      });
    }
    next();
  };
};

module.exports = { authorize };

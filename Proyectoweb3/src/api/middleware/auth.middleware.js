const jwt = require('jsonwebtoken');
const { pool } = require('../../infrastructure/database/postgres/connection');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No autorizado', message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Si es invitado
    if (decoded.rol === 'guest') {
      req.user = { id: null, rol: 'guest', isGuest: true };
      return next();
    }
    
    // Verificar en base de datos
    const result = await pool.query(
      'SELECT CodCuenta, rol, esta_activo FROM Cuenta WHERE CodCuenta = $1',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'No autorizado', message: 'Usuario no existe' });
    }
    
    if (!result.rows[0].esta_activo) {
      return res.status(401).json({ error: 'No autorizado', message: 'Cuenta desactivada' });
    }
    
    req.user = {
      id: decoded.userId,
      rol: result.rows[0].rol,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'No autorizado', message: 'Token inválido o expirado' });
  }
};

const adminMiddleware = (req, res, next) => {
  console.log('🔐 Verificando rol de admin:', req.user?.rol);
  
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ 
      error: 'Acceso denegado', 
      message: 'Se requieren permisos de administrador' 
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
const { logger } = require('../../config/logger');

const errorMiddleware = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.url} - IP: ${req.ip}`);
  
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(status).json({
    error: message,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorMiddleware;
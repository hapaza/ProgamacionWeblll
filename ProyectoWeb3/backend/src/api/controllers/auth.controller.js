const authService = require('../../../src/core/domain/services/auth.service');
const { logger } = require('../../config/logger');

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    logger.info(`Nuevo registro: ${req.body.correo}`);
    res.status(201).json(result);
  } catch (error) {
    logger.error(`Error en registro: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { correo, contraseña, captchaToken } = req.body;
    const result = await authService.login(correo, contraseña, captchaToken, req);
    logger.info(`Login exitoso: ${correo}`);
    res.json(result);
  } catch (error) {
    logger.error(`Error en login: ${error.message}`);
    res.status(401).json({ error: error.message });
  }
};

const recoveryPassword = async (req, res) => {
  try {
    const { correo } = req.body;
    await authService.requestPasswordReset(correo);
    res.json({ message: 'Si el correo existe, recibirás instrucciones' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, nuevaContraseña } = req.body;
    await authService.resetPassword(token, nuevaContraseña);
    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const guestAccess = async (req, res) => {
  try {
    const guestToken = await authService.guestAccess(req);
    res.json({ token: guestToken, rol: 'guest', message: 'Modo invitado activado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, recoveryPassword, resetPassword, guestAccess };
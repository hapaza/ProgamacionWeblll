const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../../middleware/validation.middleware');
const { register, login, recoveryPassword, resetPassword, guestAccess } = require('../../controllers/auth.controller');

const router = express.Router();

// Validaciones
const registerValidation = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('fechaNacimiento').isISO8601().withMessage('Fecha inválida'),
  body('origen').notEmpty(),
  body('correo').isEmail().withMessage('Correo inválido'),
  body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const loginValidation = [
  body('correo').isEmail().withMessage('Correo inválido'),
  body('contraseña').notEmpty().withMessage('La contraseña es requerida'),
  body('captchaToken').notEmpty().withMessage('CAPTCHA requerido')
];

const recoveryValidation = [
  body('correo').isEmail().withMessage('Correo inválido')
];

const resetValidation = [
  body('token').notEmpty(),
  body('nuevaContraseña').isLength({ min: 6 })
];

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.post('/recovery', validate(recoveryValidation), recoveryPassword);
router.post('/reset-password', validate(resetValidation), resetPassword);
router.post('/guest', guestAccess);

module.exports = router;
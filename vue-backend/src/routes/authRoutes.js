// src/routes/authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js';
import {   requestPasswordReset,  verifyResetToken,  resetPassword,cleanExpiredTokens } from '../controllers/passwordResetController.js';
import upload from '../middleware/uploadMiddleware.js';
import authMiddleware from '../middleware/autMidleware.js';
import checkRole from '../middleware/checkRole.js';
import { authLimiter,  passwordResetLimiter, passwordResetSubmitLimiter, registerLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// ==================== ROTAS DE AUTENTICAÇÃO ====================

// Registro de usuário
router.post('/register', registerLimiter, upload.single('photo'), register);

// Login de usuário
router.post('/login', authLimiter, login);

// ==================== ROTAS DE RECUPERAÇÃO DE SENHA ====================

// Solicitar recuperação de senha (público)
router.post('/password/request-reset', passwordResetLimiter, requestPasswordReset);

// Verificar token de recuperação (público)
router.get('/password/verify-token/:token', verifyResetToken);

// Redefinir senha (público)
router.post('/password/reset', passwordResetSubmitLimiter, resetPassword);

// ==================== ROTAS ADMINISTRATIVAS ====================

// Limpar tokens expirados (apenas administradores)
router.delete('/password/clean-expired', authMiddleware, checkRole(['administrador']), cleanExpiredTokens);

export default router;
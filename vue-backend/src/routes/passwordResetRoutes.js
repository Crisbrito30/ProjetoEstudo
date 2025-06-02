// src/routes/passwordResetRoutes.js
import express from 'express';
import rateLimit from 'express-rate-limit';
import { 
  requestPasswordReset, 
  verifyResetToken, 
  resetPassword, 
  cleanExpiredTokens 
} from '../controllers/passwordResetController.js';
import authMiddleware from '../middleware/autMidleware.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

// Rate limiting para recuperação de senha
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP
  message: {
    success: false,
    message: 'Muitas tentativas de recuperação. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para redefinição de senha (mais restritivo)
const passwordResetSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // máximo 3 tentativas por IP
  message: {
    success: false,
    message: 'Muitas tentativas de redefinição. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rotas públicas (não precisam de autenticação)
router.post('/request-reset', passwordResetLimiter, requestPasswordReset);
router.get('/verify-token/:token', verifyResetToken);
router.post('/reset', passwordResetSubmitLimiter, resetPassword);

// Rota administrativa (apenas administradores podem limpar tokens)
router.delete('/clean-expired', 
  authMiddleware, 
  checkRole(['administrador']), 
  cleanExpiredTokens
);

export default router;
import express from 'express';
import { updateUserRole } from '../controllers/userController.js';
import authMiddleware from '../middleware/autMidleware.js';  
import checkRole from '../middleware/checkRole.js'; 

const router = express.Router();

// Rota de atualização de permissão (role) do usuário
router.put('/users/:id/role', authMiddleware, checkRole('gestor'), updateUserRole);

export default router;

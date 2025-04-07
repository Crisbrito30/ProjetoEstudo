// src/routes/userRoutes.js
import express from 'express';
import { getUsers, updateUserRole } from '../controllers/userController.js';
import authMiddleware from '../middleware/autMidleware.js';  
import checkRole from '../middleware/checkRole.js'; 

const router = express.Router();

//  Listagem de usuários com paginação (por gestores ou administradores)
router.get('/users', authMiddleware, checkRole('gestor'), getUsers);

//  Atualização da role do usuário (por gestores ou administradores)
router.put('/users/:id/role', authMiddleware, checkRole('gestor'), updateUserRole);

export default router;

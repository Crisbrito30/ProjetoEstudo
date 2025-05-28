// src/routes/userRoutes.js
import express from 'express';
import { getUsers, updateUserRole } from '../controllers/userController.js';
import authMiddleware from '../middleware/autMidleware.js';  
import checkRole from '../middleware/checkRole.js'; 

const router = express.Router();

// Listagem de usuários - permite gestores e administradores
router.get('/users', 
  authMiddleware, 
  checkRole(['gestor', 'administrador']), // Array com as duas roles
  getUsers
);

// Atualização da role do usuário - permite gestores e administradores  
router.put('/users/:id/role', 
  authMiddleware, 
  checkRole(['gestor', 'administrador']), // Array com as duas roles
  updateUserRole
);

export default router;
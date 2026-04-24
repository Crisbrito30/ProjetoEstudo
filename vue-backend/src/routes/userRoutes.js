// src/routes/userRoutes.js
import express from 'express';
import { getUsers, getUserById, updateUserRole, deleteUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/autMidleware.js';  // Corrigido o nome do arquivo
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

// Aplicar autenticação para todas as rotas
router.use(authMiddleware);

// Rotas que precisam de permissão de gestor ou administrador
const managerPermissions = checkRole(['gestor', 'administrador']);

// Listagem de usuários - permite gestores e administradores
router.get('/users', managerPermissions, getUsers);

// Buscar usuário específico por ID
router.get('/users/:id', managerPermissions, getUserById);

// Atualização da role do usuário - permite gestores e administradores  
router.put('/users/:id/role', managerPermissions, updateUserRole);

// Deletar usuário - apenas administradores
router.delete('/users/:id', checkRole(['administrador']), deleteUser);

export default router;
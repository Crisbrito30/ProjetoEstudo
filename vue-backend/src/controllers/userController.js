//controlles/userControllrs
import User from '../models/userModel.js'; 
import userService from '../services/userService.js';

//editar permissoes do usuário
export async function updateUserRole(req, res) {
  try {
    const userId = req.params.id; // <- Pegando da URL
    const { newRole } = req.body;

    await userService.updateRole(userId, newRole);

    return res.json({ message: 'Permissão atualizada com sucesso' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

// listagem de usuarios com paginação
export async function getUsers(req, res) {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await userService.listUsers(page, limit,search);

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao listar usuários' });
  }
}

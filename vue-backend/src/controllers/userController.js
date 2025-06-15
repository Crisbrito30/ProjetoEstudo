// src/controllers/userController.js
import userService from '../services/userService.js';

// Listagem de usuários com paginação e busca
export async function getUsers(req, res) {
  try {
    const {
      search = '',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    // Validar parâmetros
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Máximo 50 por página

    const result = await userService.listUsers({
      search,
      page: pageNum,
      limit: limitNum,
      sortBy,
      sortOrder
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Não foi possível listar os usuários'
    });
  }
}

// Buscar usuário por ID
export async function getUserById(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'ID do usuário inválido'
      });
    }

    const user = await userService.findUserById(parseInt(id));

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar o usuário'
    });
  }
}

// Atualizar role do usuário
export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { newRole } = req.body;

    // Validações
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'ID do usuário inválido'
      });
    }

    if (!newRole) {
      return res.status(400).json({
        error: 'Nova role é obrigatória'
      });
    }

    // Impedir que usuário altere sua própria role
    if (parseInt(id) === req.user.userId) {
      return res.status(403).json({
        error: 'Você não pode alterar sua própria role'
      });
    }

    await userService.updateRole(parseInt(id), newRole);

    return res.status(200).json({ 
      success: true,
      message: 'Permissão atualizada com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao atualizar role:', error);
    return res.status(400).json({ 
      error: error.message || 'Erro ao atualizar permissão' 
    });
  }
}

// Deletar usuário
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'ID do usuário inválido'
      });
    }

    // Impedir que usuário delete a si mesmo
    if (parseInt(id) === req.user.userId) {
      return res.status(403).json({
        error: 'Você não pode deletar sua própria conta'
      });
    }

    await userService.deleteUser(parseInt(id));

    return res.status(200).json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return res.status(400).json({
      error: error.message || 'Erro ao deletar usuário'
    });
  }
}
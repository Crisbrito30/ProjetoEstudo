// src/services/userService.js
import User from '../models/userModel.js';
import { Op } from 'sequelize';

// Roles válidas do sistema
const VALID_ROLES = ['padrao', 'gestor', 'administrador'];

// Função para criar um novo usuário
const createUser = async (userData) => {
  try {
    const { photo, name, email, phone, hashedPassword } = userData;
    
    const newUser = await User.create({
      photo,
      name,
      email,
      phone,
      password: hashedPassword,
      roles: 'padrao', // Role padrão para novos usuários
    });
    
    // Retornar usuário sem a senha
    const { password, ...userWithoutPassword } = newUser.toJSON();
    return userWithoutPassword;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw new Error('Erro ao criar usuário: ' + error.message);
  }
};

// Função para encontrar um usuário por email
const findUserByEmail = async (email) => {
  try {
    console.log('🔍 Buscando usuário por email:', email);
    
    const user = await User.findOne({ 
      where: { email: email.toLowerCase() } // Normalizar email
    });
    
    if (user) {
      console.log('✅ Usuário encontrado:', {
        id: user.id,
        email: user.email,
        roles: user.roles
      });
    } else {
      console.log('❌ Usuário não encontrado:', email);
    }
    
    return user;
  } catch (error) {
    console.error('❌ Erro ao buscar usuário por email:', error);
    throw new Error('Erro ao buscar usuário: ' + error.message);
  }
};

// Função para encontrar usuário por ID
const findUserById = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] } // Excluir senha do retorno
    });
    
    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    throw new Error('Erro ao buscar usuário: ' + error.message);
  }
};

// Atualizar role do usuário
const updateRole = async (userId, newRole) => {
  try {
    // Validar role
    if (!VALID_ROLES.includes(newRole)) {
      throw new Error(`Role inválida. Roles válidas: ${VALID_ROLES.join(', ')}`);
    }

    // Buscar usuário
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Atualizar role
    user.roles = newRole;
    await user.save();
    
    console.log('✅ Role atualizada:', { 
      userId, 
      oldRole: user.roles, 
      newRole 
    });
    
    return user;
  } catch (error) {
    console.error('Erro ao atualizar role:', error);
    throw error;
  }
};

// Listagem de usuários com paginação e busca
const listUsers = async (options = {}) => {
  try {
    const {
      search = '',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;

    // Construir condições de busca
    const whereConditions = search.trim() ? {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    // Validar campo de ordenação
    const validSortFields = ['name', 'email', 'roles', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? 
      sortOrder.toUpperCase() : 'DESC';

    const { rows: users, count: total } = await User.findAndCountAll({
      where: whereConditions,
      offset,
      limit,
      order: [[sortField, sortDirection]],
      attributes: { exclude: ['password'] } // Excluir senhas do retorno
    });

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      search: search.trim(),
      sort: {
        field: sortField,
        order: sortDirection
      }
    };
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    throw new Error('Erro ao listar usuários: ' + error.message);
  }
};

// Deletar usuário
const deleteUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await user.destroy();
    console.log('✅ Usuário deletado:', { userId, email: user.email });
    
    return true;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
};

export default {
  createUser,
  findUserByEmail,
  findUserById,
  updateRole,
  listUsers,
  deleteUser,
  VALID_ROLES // Exportar roles válidas para uso em outros lugares
};
// src/services/userService.js
import User from '../models/userModel.js';  // Importa o modelo de Usuário
import { Op } from 'sequelize';

// Função para criar um novo usuário
const createUser = async (photo,name, email, phone, hashedPassword) => {
  try {
    const newUser = await User.create({
      photo,
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'padrao',  // Define o novo usuário como padrão
    });
    return newUser;
  } catch (error) {
    throw new Error('Erro ao criar usuário: ' + error.message);
  }
};

// Função para encontrar um usuário por email
const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    throw new Error('Erro ao buscar usuário: ' + error.message);
  }
};


//Validação de roles
const validRoles = ['padrao', 'gestor', 'administrador'];

const updateRole = async (userId, newRole) => {
  if (!validRoles.includes(newRole)) {
    throw new Error('Permissão inválida');
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  user.roles = newRole;
  await user.save();
};

// listagem de usuarios com paginação

const listUsers = async (page = 1, limit = 10, search = '') => {
  const offset = (page - 1) * limit;

  const where = search
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  const { rows: users, count: total } = await User.findAndCountAll({
    where,
    offset,
    limit,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'photo', 'name', 'email', 'phone', 'roles'],
  });

  return {
    users,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};

export default {
  createUser,
  findUserByEmail,
  updateRole,
  listUsers,
};


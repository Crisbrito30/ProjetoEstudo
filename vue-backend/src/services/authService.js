// src/services/userService.js
import User from '../models/userModel.js';  // Importa o modelo de Usuário

// Função para criar um novo usuário
const createUser = async (name, email, hashedPassword) => {
  try {
    const newUser = await User.create({name, email, password: hashedPassword });
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

export default  { createUser, findUserByEmail };

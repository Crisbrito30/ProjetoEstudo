import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userService from '../services/authService.js';  // Importa os serviços de usuário

// Registrar um novo usuário
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email já registrado' });
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    const newUser = await userService.createUser(name, email, hashedPassword);
    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao registrar usuário' });
  } 
}

// Login do usuário
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Encontra o usuário pelo email
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se a senha está correta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    // Gera o token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      message: 'Login bem-sucedido',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao fazer login' });
  }
}

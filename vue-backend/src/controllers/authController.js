//src/authcontroller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userService from '../services/userService.js';  // Importa os serviços de usuário


// Registrar um novo usuário
export async function register(req, res) {
  try {
    const { name, email, phone, password  } = req.body;
    console.log('Dados recebidos no register:', req.body);  // 
    if (!name || !email ||  !phone || !password ) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const newUser = await userService.createUser(photoPath, name,  email, phone, hashedPassword );

    return res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
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
    const token = jwt.sign(
      { userId: user.id, role: user.roles },  // Pegando do banco corretamente
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    

    return res.json({
      message: 'Login bem-sucedido',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao fazer login' });
  }
}


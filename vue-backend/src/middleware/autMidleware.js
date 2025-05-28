//src/middleware/aumidlleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel.js'; // Importe o modelo de usuário

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 

  if (!token) {
    return res.status(403).json({ message: 'Token de autenticação não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário no banco e pegar a role diretamente
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Adicionar a role ao req.user
    req.user = { userId: decoded.userId, roles: user.roles };  

    // console.log('Usuário autenticado:', req.user);  // Teste para ver se a role está vindo corretamente

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

export default authMiddleware;

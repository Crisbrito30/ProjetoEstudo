import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const authMiddleware = (req, res, next) => {
  // O token deve ser enviado no cabeçalho Authorization com o prefixo "Bearer"
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 

  // Se o token não foi fornecido, retorne erro 403
  if (!token) {
    return res.status(403).json({ message: 'Token de autenticação não fornecido' });
  }

  // Verificar o token utilizando a chave secreta armazenada no .env
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Se o token for inválido ou expirado, retorne erro 401
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }

    // Se o token for válido, armazenamos as informações do usuário (decodificado)
    req.user = decoded; 

    // Continue para a próxima função de middleware ou rota
    next();
  });
};

export default authMiddleware;

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRouter from './src/routes/authRoutes.js';  // Certifique-se de que o caminho esteja correto
import userRouter from './src/routes/userRoutes.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Usar as rotas de autenticação
app.use('/api', authRouter);  
app.use('/api', userRouter);
// Permitir acesso público aos arquivos na pasta 'uploads'
app.use('/uploads', express.static('uploads'));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

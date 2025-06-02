import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRouter from './src/routes/authRoutes.js';
import userRouter from './src/routes/userRoutes.js';

// Importação correta das funções do controller (não como módulo inteiro)
import passwordResetRoutes from './src/routes/passwordResetRoutes.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Usar as rotas de autenticação e usuários
app.use('/api', authRouter);  
app.use('/api', userRouter);
app.use('/api/password-reset', passwordResetRoutes);
// Rotas de recuperação de senha (usando as funções diretamente)
// app.post('/api/password-reset/request', requestPasswordReset);
// app.get('/api/password-reset/verify/:token', verifyResetToken);
// app.post('/api/password-reset/reset', resetPassword);
// app.delete('/api/password-reset/cleanup', cleanExpiredTokens);

// Permitir acesso público aos arquivos na pasta 'uploads'
app.use('/uploads', express.static('uploads'));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
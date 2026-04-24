import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import login from './src/routes/authRoutes.js';
import userRouter from './src/routes/userRoutes.js';


// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Usar as rotas de autenticação e usuários
app.use('/api', login);  
app.use('/api', userRouter);

app.use('/uploads', express.static('uploads'));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
// src/config/db.js
import dotenv from 'dotenv';
import Sequelize from 'sequelize';

// Carregar variáveis de ambiente
dotenv.config();


// Configuração do Sequelize
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  logging: false,  
});

export default sequelize;

// src/config/db.js
import dotenv from "dotenv";
import Sequelize from "sequelize";
import "../models/userModel.js";  // Certifique-se de importar todos os modelos

// Carregar variáveis de ambiente
dotenv.config();


// Configuração do Sequelize
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: decodeURIComponent(process.env.DB_PASSWORD),
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  logging: false,
});

// Teste de conexão
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

sequelize.sync({ alter: true }) // Isso cria e altera tabelas automaticamente
  .then(() => console.log("📌 Banco de dados sincronizado."))
  .catch((error) => console.error("Erro ao sincronizar o banco:", error));


export default sequelize;

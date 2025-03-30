import dotenv from "dotenv";
import Sequelize from "sequelize";
import "../models/userModel.js"; 

// Carregar variáveis de ambiente
dotenv.config({ path: "./.env" });

// Configuração do Sequelize
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Removido decodeURIComponent
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  logging: false,
});

// Teste de conexão 
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão bem-sucedida com o banco de dados.");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
  }
})();

// Sincronizar banco de dados
sequelize.sync({ alter: true })
  .then(() => console.log("📌 Banco de dados sincronizado."))
  .catch((error) => console.error("❌ Erro ao sincronizar o banco:", error));

export default sequelize;

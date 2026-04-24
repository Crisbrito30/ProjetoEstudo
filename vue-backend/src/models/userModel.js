//src/models/userModel.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';  // Conexão com o banco de dados

// Definição do modelo do usuário
class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    photo: {
      type: DataTypes.BLOB('long'),
      allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
      roles:{
        type:DataTypes.ENUM('padrao', 'gestor', 'administrador'),
        allowNull:false,
        defaultValue: 'padrao',
      },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',  // Nome da tabela no banco de dados
    timestamps: true,    // Adiciona createdAt e updatedAt automaticamente
  }
);

export default User;

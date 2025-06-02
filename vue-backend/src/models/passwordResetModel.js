// src/models/passwordResetModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';

const PasswordReset = sequelize.define('PasswordReset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: { // Manter camelCase no código
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id', // Mapear para snake_case no banco
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  token: {
    type: DataTypes.TEXT, // Mudar para TEXT como está no banco
    allowNull: false,
    unique: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at', // Mapear para snake_case
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at', // Mapear para snake_case
  },
}, {
  tableName: 'password_resets',
  timestamps: false,
  indexes: [
    {
      fields: ['token'],
      unique: true,
    },
    {
      fields: ['user_id'], // Usar o nome real da coluna no banco
    },
    {
      fields: ['expires_at'], // Usar o nome real da coluna no banco
    },
  ],
});

// Definir associações (agora consistente)
PasswordReset.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(PasswordReset, { foreignKey: 'userId', as: 'passwordResets' });

export default PasswordReset;
// src/services/passwordResetService.js
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import PasswordReset from '../models/passwordResetModel.js';
import User from '../models/userModel.js';
import { Op } from 'sequelize';

class PasswordResetService {
  
  // Gerar token seguro
  generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Criar token de recuperação
  async createResetToken(userId) {
    try {
      // Primeiro, invalidar tokens anteriores do usuário
      await PasswordReset.update(
        { used: true },
        { 
          where: { 
            userId: userId,
            used: false,
            expiresAt: { [Op.gt]: new Date() }
          }
        }
      );

      // Gerar novo token
      const token = this.generateResetToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

      // Salvar no banco
      const resetToken = await PasswordReset.create({
        userId,
        token,
        expiresAt,
        used: false
      });

      console.log('✅ Token de recuperação criado:', { userId, token: token.substring(0, 8) + '...' });
      return token;

    } catch (error) {
      console.error('❌ Erro ao criar token de recuperação:', error);
      throw new Error('Erro ao criar token de recuperação');
    }
  }

  // Verificar se token é válido
  async verifyResetToken(token) {
    try {
      const resetData = await PasswordReset.findOne({
        where: {
          token: token,
          used: false,
          expiresAt: { [Op.gt]: new Date() }
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'name']
        }]
      });

      if (!resetData) {
        console.log('❌ Token inválido ou expirado:', token.substring(0, 8) + '...');
        return null;
      }

      console.log('✅ Token válido encontrado:', { 
        userId: resetData.userId, 
        email: resetData.user.email 
      });
      
      return resetData;

    } catch (error) {
      console.error('❌ Erro ao verificar token:', error);
      throw new Error('Erro ao verificar token');
    }
  }

  // Redefinir senha
  async resetPassword(token, newPassword) {
    try {
      // Verificar token
      const resetData = await this.verifyResetToken(token);
      
      if (!resetData) {
        throw new Error('Token inválido, expirado ou já utilizado');
      }

      // Criptografar nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Atualizar senha do usuário
      await User.update(
        { password: hashedPassword },
        { where: { id: resetData.userId } }
      );

      // Marcar token como usado
      await PasswordReset.update(
        { used: true },
        { where: { id: resetData.id } }
      );

      console.log('✅ Senha redefinida com sucesso:', { 
        userId: resetData.userId,
        email: resetData.user.email 
      });

      return {
        success: true,
        user: resetData.user
      };

    } catch (error) {
      console.error('❌ Erro ao redefinir senha:', error);
      throw error;
    }
  }

  // Limpar tokens expirados (executar periodicamente)
  async cleanExpiredTokens() {
    try {
      const deletedCount = await PasswordReset.destroy({
        where: {
          [Op.or]: [
            { expiresAt: { [Op.lt]: new Date() } },
            { used: true }
          ]
        }
      });

      if (deletedCount > 0) {
        console.log(`🧹 ${deletedCount} tokens expirados/usados removidos`);
      }

      return deletedCount;

    } catch (error) {
      console.error('❌ Erro ao limpar tokens expirados:', error);
      throw error;
    }
  }

  // Verificar se usuário tem muitas tentativas recentes
  async checkResetAttempts(userId, timeWindowMinutes = 15) {
    try {
      const timeWindow = new Date(Date.now() - timeWindowMinutes * 60 * 1000);
      
      const recentAttempts = await PasswordReset.count({
        where: {
          userId: userId,
          createdAt: { [Op.gte]: timeWindow }
        }
      });

      return recentAttempts;

    } catch (error) {
      console.error('❌ Erro ao verificar tentativas:', error);
      return 0;
    }
  }
}

export default new PasswordResetService();
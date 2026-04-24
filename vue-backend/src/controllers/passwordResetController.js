// src/controllers/passwordResetController.js
import userService from '../services/userService.js';
import passwordResetService from '../services/passwordResetService.js';
import emailService from '../services/emailService.js';

// Validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar força da senha
function isStrongPassword(password) {
  // Pelo menos 6 caracteres, 1 letra e 1 número
  const minLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return minLength && hasLetter && hasNumber;
}

// 1. SOLICITAR RECUPERAÇÃO DE SENHA
export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    // Validações básicas
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    console.log('🔍 Solicitação de recuperação para:', email);

    // Buscar usuário
    const user = await userService.findUserByEmail(email.toLowerCase());
    
    if (!user) {
      // Por segurança, sempre retorna sucesso mesmo se email não existir
      console.log('❌ Email não encontrado:', email);
      return res.status(200).json({
        success: true,
        message: 'Se o email existir em nosso sistema, você receberá instruções de recuperação'
      });
    }

    // Verificar limite de tentativas (máximo 3 em 15 minutos)
    const recentAttempts = await passwordResetService.checkResetAttempts(user.id, 15);
    if (recentAttempts >= 3) {
      console.log('⚠️ Muitas tentativas de recuperação:', { email, attempts: recentAttempts });
      return res.status(429).json({
        success: false,
        message: 'Muitas tentativas de recuperação. Tente novamente em 15 minutos'
      });
    }

    // Criar token de recuperação
    const resetToken = await passwordResetService.createResetToken(user.id);

    // Enviar email
    await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);

    console.log('✅ Recuperação processada com sucesso:', { email: user.email });

    return res.status(200).json({
      success: true,
      message: 'Se o email existir em nosso sistema, você receberá instruções de recuperação'
    });

  } catch (error) {
    console.error('❌ Erro ao solicitar recuperação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor. Tente novamente mais tarde'
    });
  }
}

// 2. VERIFICAR TOKEN DE RECUPERAÇÃO
export async function verifyResetToken(req, res) {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token é obrigatório'
      });
    }

    console.log('🔍 Verificando token:', token.substring(0, 8) + '...');

    // Verificar se token é válido
    const resetData = await passwordResetService.verifyResetToken(token);

    if (!resetData) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido, expirado ou já utilizado'
      });
    }

    console.log('✅ Token válido:', { email: resetData.user.email });

    return res.status(200).json({
      success: true,
      message: 'Token válido',
      data: {
        email: resetData.user.email,
        name: resetData.user.name
      }
    });

  } catch (error) {
    console.error('❌ Erro ao verificar token:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}

// 3. REDEFINIR SENHA
export async function resetPassword(req, res) {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    // Validações
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'As senhas não coincidem'
      });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres, incluindo letras e números'
      });
    }

    console.log('🔄 Tentando redefinir senha com token:', token.substring(0, 8) + '...');

    // Redefinir senha
    const result = await passwordResetService.resetPassword(token, newPassword);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Erro ao redefinir senha'
      });
    }

    // Enviar email de confirmação
    try {
      await emailService.sendPasswordChangedConfirmation(
        result.user.email, 
        result.user.name
      );
    } catch (emailError) {
      console.log('⚠️ Email de confirmação não enviado:', emailError.message);
      // Não falha o processo principal
    }

    console.log('✅ Senha redefinida com sucesso:', { email: result.user.email });

    return res.status(200).json({
      success: true,
      message: 'Senha redefinida com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao redefinir senha:', error);
    
    // Tratamento específico de erros
    if (error.message.includes('Token inválido')) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido, expirado ou já utilizado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}

// 4. LIMPEZA DE TOKENS (rota administrativa)
export async function cleanExpiredTokens(req, res) {
  try {
    const deletedCount = await passwordResetService.cleanExpiredTokens();
    
    return res.status(200).json({
      success: true,
      message: `${deletedCount} tokens expirados removidos`,
      deletedCount
    });

  } catch (error) {
    console.error('❌ Erro ao limpar tokens:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao limpar tokens expirados'
    });
  }
}
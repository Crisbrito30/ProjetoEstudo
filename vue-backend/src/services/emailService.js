// src/services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // Configuração para Gmail (mais comum e gratuito)
    if (process.env.EMAIL_PROVIDER === 'gmail') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS // Senha de app do Gmail
        }
      });
    }

    // Configuração para Outlook/Hotmail
    if (process.env.EMAIL_PROVIDER === 'outlook') {
      return nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }

    // Configuração genérica SMTP (para outros provedores)
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Verificar se configuração de email está funcionando
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Configuração de email verificada com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro na configuração de email:', error.message);
      return false;
    }
  }

  // Enviar email de recuperação de senha
  async sendPasswordResetEmail(email, userName, resetToken) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: {
          name: process.env.APP_NAME || 'Sua Aplicação',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Recuperação de Senha',
        html: this.getPasswordResetTemplate(userName, resetUrl)
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Email de recuperação enviado:', { 
        to: email, 
        messageId: result.messageId 
      });
      
      return {
        success: true,
        messageId: result.messageId
      };

    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      throw new Error('Erro ao enviar email de recuperação');
    }
  }

  // Template HTML para email de recuperação
  getPasswordResetTemplate(userName, resetUrl) {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperação de Senha</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Recuperação de Senha</h1>
          </div>

          <!-- Content -->
          <div style="padding: 30px; background-color: white;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Olá <strong>${userName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 25px;">
              Você solicitou a recuperação de sua senha. Clique no botão abaixo para definir uma nova senha:
            </p>

            <!-- Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        display: inline-block; 
                        font-weight: bold; 
                        font-size: 16px;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                🔑 Redefinir Minha Senha
              </a>
            </div>

            <!-- Security Info -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 25px 0;">
              <h3 style="color: #155724; margin: 0 0 10px 0; font-size: 16px;">
                ⚡ Informações Importantes:
              </h3>
              <ul style="color: #155724; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Este link expira em <strong>1 hora</strong></li>
                <li>Só pode ser usado <strong>uma vez</strong></li>
                <li>Se você não solicitou, <strong>ignore este email</strong></li>
              </ul>
            </div>

            <!-- Alternative Link -->
            <p style="font-size: 14px; color: #666; margin-top: 25px;">
              Se o botão não funcionar, copie e cole este link no seu navegador:
            </p>
            <p style="font-size: 14px; color: #667eea; word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">
              ${resetUrl}
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border-top: 1px solid #e9ecef;">
            <p style="font-size: 12px; color: #6c757d; margin: 0;">
              Este email foi enviado automaticamente. Por favor, não responda.
            </p>
            <p style="font-size: 12px; color: #6c757d; margin: 5px 0 0 0;">
              © ${new Date().getFullYear()} ${process.env.APP_NAME || 'Sua Aplicação'}. Todos os direitos reservados.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;
  }

  // Enviar email de confirmação (após senha alterada)
  async sendPasswordChangedConfirmation(email, userName) {
    try {
      const mailOptions = {
        from: {
          name: process.env.APP_NAME || 'Sua Aplicação',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Senha Alterada com Sucesso',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 20px; text-align: center; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: white; margin: 0;">✅ Senha Alterada</h2>
            </div>
            <p>Olá <strong>${userName}</strong>,</p>
            <p>Sua senha foi alterada com sucesso em ${new Date().toLocaleString('pt-BR')}.</p>
            <p>Se você não fez esta alteração, entre em contato conosco imediatamente.</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Atenciosamente,<br>
              Equipe ${process.env.APP_NAME || 'Sua Aplicação'}
            </p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de confirmação enviado:', { to: email });

    } catch (error) {
      console.error('❌ Erro ao enviar email de confirmação:', error);
      // Não falha o processo se o email de confirmação não for enviado
    }
  }
}

export default new EmailService();
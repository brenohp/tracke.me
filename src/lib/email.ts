// src/lib/email.ts

import { Resend } from 'resend';

// Valida se a chave de API do Resend foi definida no ambiente.
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  throw new Error("A variável de ambiente RESEND_API_KEY não está definida.");
}

// Inicializa o cliente do Resend com a chave de API
const resend = new Resend(resendApiKey);

// Exportamos o serviço de e-mail com as funções que vamos precisar
export const emailService = {

  /**
   * Envia o e-mail de confirmação de conta para um novo usuário.
   * @param to - O endereço de e-mail do destinatário.
   * @param name - O nome do destinatário para personalização.
   * @param confirmationLink - O link que o usuário deve clicar para confirmar a conta.
   */
  sendAccountConfirmation: async (to: string, name: string, confirmationLink: string) => {
    try {
      const { data, error } = await resend.emails.send({
        from: 'CliendaApp <nao-responda@clienda.app>',
        to: [to],
        subject: `Bem-vindo(a) ao CliendaApp, ${name}!`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1 style="color: #021B33;">Bem-vindo(a) ao CliendaApp!</h1>
            <p>Olá ${name},</p>
            <p>Estamos felizes em ter você conosco. Falta apenas um passo para você começar a otimizar a gestão do seu negócio.</p>
            <p>Por favor, clique no botão abaixo para confirmar seu endereço de e-mail e ativar sua conta:</p>
            <a href="${confirmationLink}" style="background-color: #12577B; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
              Confirmar minha conta
            </a>
            <p>Se você não se cadastrou no CliendaApp, por favor ignore este e-mail.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 0.9em; color: #555;">
              Precisa de ajuda? <a href="mailto:suporte@clienda.app">Envie um e-mail para o nosso suporte</a>.
            </p>
          </div>
        `,
      });

      if (error) {
        throw error;
      }
      console.log('E-mail de confirmação enviado com sucesso:', data);
      return data;
    } catch (error) {
      console.error("Erro ao enviar e-mail de confirmação:", error);
      throw new Error("Não foi possível enviar o e-mail de confirmação.");
    }
  },

  // ==========================================================
  // NOVA FUNÇÃO ADICIONADA AQUI
  // ==========================================================
  /**
   * Envia o e-mail de redefinição de senha.
   * @param to - O endereço de e-mail do destinatário.
   * @param name - O nome do destinatário para personalização.
   * @param resetLink - O link que o usuário deve clicar para redefinir a senha.
   */
  sendPasswordReset: async (to: string, name: string, resetLink: string) => {
    try {
      const { data, error } = await resend.emails.send({
        from: 'CliendaApp <nao-responda@clienda.app>',
        to: [to],
        subject: 'Redefinição de Senha - CliendaApp',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1 style="color: #021B33;">Solicitação de Redefinição de Senha</h1>
            <p>Olá ${name},</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta no CliendaApp. Se você não fez essa solicitação, pode ignorar este e-mail com segurança.</p>
            <p>Para criar uma nova senha, clique no botão abaixo. Este link é válido por 1 hora.</p>
            <a href="${resetLink}" style="background-color: #12577B; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
              Redefinir Minha Senha
            </a>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 0.9em; color: #555;">
              Precisa de ajuda? <a href="mailto:suporte@clienda.app">Envie um e-mail para o nosso suporte</a>.
            </p>
          </div>
        `,
      });

      if (error) {
        throw error;
      }
      console.log('E-mail de redefinição de senha enviado com sucesso:', data);
      return data;
    } catch (error) {
      console.error("Erro ao enviar e-mail de redefinição de senha:", error);
      throw new Error("Não foi possível enviar o e-mail de redefinição de senha.");
    }
  },
};
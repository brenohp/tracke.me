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
   * @param confirmationLink - O link que o usuário deve clicar para confirmar a conta.
   */
  sendAccountConfirmation: async (to: string, confirmationLink: string) => {
    try {
      const { data, error } = await resend.emails.send({
        from: 'CliendaApp <nao-responda@clienda.app>',
        to: [to],
        subject: 'Confirme sua conta no CliendaApp',
        html: `
          <div>
            <h1>Bem-vindo ao CliendaApp!</h1>
            <p>Estamos felizes em ter você conosco. Por favor, clique no link abaixo para confirmar seu e-mail e ativar sua conta:</p>
            <a href="${confirmationLink}" style="background-color: #12577B; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Confirmar Conta
            </a>
            <p>Se você não se cadastrou no CliendaApp, por favor ignore este e-mail.</p>
          </div>
        `,
      });

      if (error) {
        // Se houver um erro da API do Resend, nós o lançamos para ser tratado
        throw error;
      }

      console.log('E-mail de confirmação enviado com sucesso:', data);
      return data;

    } catch (error) {
      console.error("Erro ao enviar e-mail de confirmação:", error);
      // Lança um novo erro para que a função que chamou saiba que algo deu errado
      throw new Error("Não foi possível enviar o e-mail de confirmação.");
    }
  },

  // Futuramente, podemos adicionar outras funções aqui, como:
  // sendPasswordReset: async (to: string, resetLink: string) => { ... }
};
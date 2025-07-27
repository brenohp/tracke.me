// Caminho: src/lib/pusher/server.ts

import PusherServer from 'pusher';

// Valida se as variáveis de ambiente essenciais estão presentes para evitar erros.
if (!process.env.PUSHER_APP_ID || !process.env.PUSHER_KEY || !process.env.PUSHER_SECRET || !process.env.PUSHER_CLUSTER) {
  throw new Error('As variáveis de ambiente do Pusher não estão definidas corretamente no arquivo .env');
}

// Exporta uma instância única (singleton) do Pusher Server para ser usada em todo o backend.
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true, // Sempre use TLS (conexão segura)
});
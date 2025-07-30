// Caminho: src/lib/pusher/server.ts

import PusherServer from 'pusher';

const appId = process.env.PUSHER_APP_ID;
const key = process.env.PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.PUSHER_CLUSTER;

// Verificação com logs para depuração
if (!appId || !key || !secret || !cluster) {
  console.log('--- Depurando Variáveis de Ambiente do Pusher ---');
  console.log('PUSHER_APP_ID está definida:', !!appId);
  console.log('PUSHER_KEY está definido:', !!key);
  console.log('PUSHER_SECRET está definido:', !!secret);
  console.log('PUSHER_CLUSTER está definido:', !!cluster);
  console.log('----------------------------------------------------');
  
  throw new Error('Uma ou mais variáveis de ambiente do Pusher não foram encontradas. Verifique os logs de build acima.');
}

// Exporta uma instância única (singleton) do Pusher Server
export const pusherServer = new PusherServer({
  appId,
  key,
  secret,
  cluster,
  useTLS: true,
});
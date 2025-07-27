// Caminho: src/lib/pusher/client.ts
"use client";

import PusherClient from 'pusher-js';

// Valida se as variáveis de ambiente do frontend estão presentes.
if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error('As variáveis de ambiente do Pusher no frontend não estão definidas.');
}

// Exporta uma instância única do cliente Pusher para o frontend.
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    // Aponta para a nossa API de autenticação que criamos anteriormente.
    authEndpoint: '/api/pusher/auth',
    authTransport: 'ajax',
  }
);
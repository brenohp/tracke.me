// Caminho: src/app/api/pusher/auth/route.ts

import { pusherServer } from '@/lib/pusher/server';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  // 1. Se não houver sessão, o usuário não pode se autenticar.
  if (!session) {
    return new Response('Não autorizado', { status: 403 });
  }

  const formData = await request.formData();
  const socketId = formData.get('socket_id') as string;
  const channel = formData.get('channel_name') as string;

  // 2. Segurança: Verifica se o usuário tentando se inscrever no canal é o mesmo da sessão.
  // O formato do nosso canal será 'private-notifications-USER_ID'
  const userIdFromChannel = channel.replace('private-notifications-', '');
  if (userIdFromChannel !== session.userId) {
    return new Response('Não autorizado', { status: 403 });
  }

  // Dados do usuário que podem ser úteis no frontend (opcional)
  const userData = {
    user_id: session.userId,
  };

  // 3. Autoriza a inscrição no canal privado.
  const authResponse = pusherServer.authorizeChannel(socketId, channel, userData);
  
  return NextResponse.json(authResponse);
}
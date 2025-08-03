// Caminho: src/app/api/admin/communication/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';
import { NotificationService } from '@/lib/services/notification.service';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  // Segurança: Apenas admins podem usar este endpoint
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const { message, targetPlanId } = await request.json();

    if (!message || message.trim() === '') {
      return NextResponse.json({ message: 'A mensagem é obrigatória.' }, { status: 400 });
    }

    // Dispara o serviço para rodar em segundo plano (fire-and-forget)
    NotificationService.systemUpdate(message, targetPlanId);

    // Retorna uma resposta imediata para o admin, enquanto o envio acontece
    return NextResponse.json({ message: 'Comunicado está sendo enviado para os clientes.' }, { status: 202 }); // 202 Accepted

  } catch (error) {
    console.error('Erro na API de comunicação:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}
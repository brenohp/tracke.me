// src/app/api/appointments/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';

interface RouteContext {
  params: { id: string };
}

export async function PUT(request: Request, { params }: RouteContext) {
  const appointmentId = params.id;
  
  // Bloco de Autenticação CORRIGIDO
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Token de autorização ausente ou malformatado.' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const session = verifyToken(token);

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado ou token inválido.' }, { status: 401 });
  }

  try {
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, professionalId: session.userId }
    });
    
    if (!appointment) {
      return NextResponse.json({ message: 'Agendamento não encontrado ou acesso negado.' }, { status: 404 });
    }

    const body = await request.json();
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error(`Erro ao atualizar agendamento ${appointmentId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const appointmentId = params.id;

  // Bloco de Autenticação CORRIGIDO
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Token de autorização ausente ou malformatado.' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const session = verifyToken(token);

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado ou token inválido.' }, { status: 401 });
  }

  try {
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, professionalId: session.userId }
    });
    
    if (!appointment) {
      return NextResponse.json({ message: 'Agendamento não encontrado ou acesso negado.' }, { status: 404 });
    }

    const canceledAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CANCELED',
      },
    });

    return NextResponse.json(canceledAppointment, { status: 200 });
  } catch (error) {
    console.error(`Erro ao cancelar agendamento ${appointmentId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}
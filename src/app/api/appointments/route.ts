// src/app/api/appointments/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { addMinutes, parseISO } from 'date-fns';

export async function POST(request: Request) {
  // Bloco de Autenticação CORRIGIDO
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Token de autorização ausente ou malformatado.' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const session = verifyToken(token);

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado ou token inválido.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { clientId, serviceId, startTime } = body;

    if (!clientId || !serviceId || !startTime) {
      return NextResponse.json({ message: 'Cliente, serviço e horário de início são obrigatórios.' }, { status: 400 });
    }
    
    const service = await prisma.service.findFirst({
      where: { id: serviceId, businessId: session.businessId }
    });
    const client = await prisma.client.findFirst({
      where: { id: clientId, businessId: session.businessId }
    });

    if (!service || !client) {
      return NextResponse.json({ message: 'Serviço ou Cliente não encontrado ou não pertence a este negócio.' }, { status: 404 });
    }

    const appointmentStartTime = parseISO(startTime);
    const appointmentEndTime = addMinutes(appointmentStartTime, service.duration);

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        professionalId: session.userId,
        status: { not: 'CANCELED' },
        startTime: { lt: appointmentEndTime },
        endTime: { gt: appointmentStartTime },
      },
    });

    if (conflictingAppointment) {
      return NextResponse.json({ message: 'Conflito de horário. Já existe um agendamento neste período.' }, { status: 409 });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        startTime: appointmentStartTime,
        endTime: appointmentEndTime,
        clientId,
        serviceId,
        professionalId: session.userId,
        status: 'SCHEDULED',
      },
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Bloco de Autenticação CORRIGIDO
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const session = verifyToken(token);

  if (!session) {
    return NextResponse.json({ message: 'Token inválido ou expirado.' }, { status: 401 });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        professionalId: session.userId,
      },
      include: {
        client: true,
        service: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}
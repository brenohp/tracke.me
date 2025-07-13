// Caminho: src/app/api/appointments/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { addMinutes, parseISO } from 'date-fns';

// Função para CRIAR um novo agendamento
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { serviceId, clientId, professionalId, startTime } = body;

    if (!serviceId || !clientId || !professionalId || !startTime) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json({ message: 'Serviço não encontrado.' }, { status: 404 });
    }

    const startTimeDate = parseISO(startTime);
    const endTimeDate = addMinutes(startTimeDate, service.durationInMinutes);

    const newAppointment = await prisma.appointment.create({
      data: {
        startTime: startTimeDate,
        endTime: endTimeDate,
        status: 'SCHEDULED',
        clientId,
        serviceId,
        professionalId,
      },
    });

    // CORREÇÃO: Aponta para o novo caminho em inglês
    revalidatePath('/dashboard/schedule');

    return NextResponse.json(newAppointment, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor ao criar o agendamento.' },
      { status: 500 }
    );
  }
}
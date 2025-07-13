// Caminho: src/app/api/appointments/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // 1. CORREÇÃO: Importa os tipos diretamente do Prisma Client
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

// Função GET para listar os agendamentos, com filtros
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const search = searchParams.get('search');

    const whereClause: Prisma.AppointmentWhereInput = {
      professional: {
        businessId: session.businessId,
      },
    };

    if (start && end) {
      whereClause.startTime = { gte: new Date(start) };
      whereClause.endTime = { lte: new Date(end) };
    }

    if (search) {
      whereClause.client = {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }
    
    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        client: { select: { name: true } },
        service: { select: { name: true } },
        professional: { select: { name: true } },
      },
      orderBy: {
        startTime: 'desc',
      }
    });

    if (start && end) {
      const calendarEvents = appointments.map(apt => ({
        id: apt.id,
        title: `${apt.client.name} - ${apt.service.name}`,
        start: apt.startTime.toISOString(),
        end: apt.endTime.toISOString(),
        extendedProps: {
          status: apt.status,
          clientId: apt.clientId,
          serviceId: apt.serviceId,
          professionalId: apt.professionalId,
        }
      }));
      return NextResponse.json(calendarEvents, { status: 200 });
    } else {
      return NextResponse.json(appointments, { status: 200 });
    }
    
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor.' },
      { status: 500 }
    );
  }
}
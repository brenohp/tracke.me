// Caminho: src/app/api/appointments/route.ts

import { NextResponse, type NextRequest } from 'next/server';
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

// NOVA FUNÇÃO PARA LISTAR OS AGENDAMENTOS
export async function GET(request: NextRequest) {
  // 1. Autenticação
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    // 2. Busca os parâmetros de data da URL
    const { searchParams } = request.nextUrl;
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json(
        { message: 'Os parâmetros de data "start" e "end" são obrigatórios.' },
        { status: 400 }
      );
    }
    
    // 3. Busca os agendamentos no banco de dados para o período selecionado
    const appointments = await prisma.appointment.findMany({
      where: {
        // Encontra agendamentos de todos os profissionais do mesmo negócio
        professional: {
          businessId: session.businessId,
        },
        // Filtra pelo período de datas
        startTime: {
          gte: new Date(start), // gte = Greater Than or Equal (maior ou igual a)
        },
        endTime: {
          lte: new Date(end), // lte = Less Than or Equal (menor ou igual a)
        },
      },
      include: {
        client: { select: { name: true } }, // Inclui o nome do cliente
        service: { select: { name: true } }, // Inclui o nome do serviço
      },
    });

    // 4. Formata os dados para o formato que o FullCalendar entende
    const calendarEvents = appointments.map(apt => ({
      id: apt.id,
      title: `${apt.client.name} - ${apt.service.name}`,
      start: apt.startTime.toISOString(),
      end: apt.endTime.toISOString(),
      // Adicionamos dados extras que usaremos depois para cores e modais
      extendedProps: {
        status: apt.status,
        clientId: apt.clientId,
        serviceId: apt.serviceId,
        professionalId: apt.professionalId,
      }
    }));

    return NextResponse.json(calendarEvents, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor.' },
      { status: 500 }
    );
  }
}
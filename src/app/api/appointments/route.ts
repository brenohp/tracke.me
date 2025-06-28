// src/app/api/appointments/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { addMinutes, parseISO } from 'date-fns';

export async function POST(request: Request) {
  // 1. Autenticação e Autorização
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
    // 2. Extração e Validação dos Dados de Entrada
    const body = await request.json();
    const { clientId, serviceId, startTime } = body;

    if (!clientId || !serviceId || !startTime) {
      return NextResponse.json({ message: 'Cliente, serviço e horário de início são obrigatórios.' }, { status: 400 });
    }
    
    // 3. Verificações de Negócio (dentro de uma transação para garantir a integridade)
    const service = await prisma.service.findFirst({
      where: { id: serviceId, userId: session.userId }
    });

    const client = await prisma.client.findFirst({
      where: { id: clientId, userId: session.userId }
    });

    if (!service || !client) {
      return NextResponse.json({ message: 'Serviço ou Cliente não encontrado ou não pertence a este profissional.' }, { status: 404 });
    }

    // 4. Cálculo de Horário e Verificação de Conflito
    const appointmentStartTime = parseISO(startTime);
    const appointmentEndTime = addMinutes(appointmentStartTime, service.duration);

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        professionalId: session.userId,
        status: { not: 'CANCELED' }, // Não considera agendamentos cancelados
        // A lógica principal: um conflito existe se um agendamento existente
        // começa antes do nosso novo terminar E termina depois do nosso novo começar.
        startTime: {
          lt: appointmentEndTime,
        },
        endTime: {
          gt: appointmentStartTime,
        },
      },
    });

    if (conflictingAppointment) {
      return NextResponse.json({ message: 'Conflito de horário. Já existe um agendamento neste período.' }, { status: 409 }); // 409 Conflict
    }

    // 5. Criação do Agendamento
    const newAppointment = await prisma.appointment.create({
      data: {
        startTime: appointmentStartTime,
        endTime: appointmentEndTime,
        clientId: clientId,
        serviceId: serviceId,
        professionalId: session.userId,
        status: 'SCHEDULED', // Status inicial
      },
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função para LISTAR os agendamentos do profissional
export async function GET(request: Request) {
  // 1. Autenticação
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
    // 2. Busca no banco os agendamentos do profissional logado
    const appointments = await prisma.appointment.findMany({
      where: {
        professionalId: session.userId,
      },
      // O 'include' é muito poderoso: ele traz os dados do cliente e do serviço
      // junto com cada agendamento, evitando que o frontend precise fazer múltiplas chamadas.
      include: {
        client: true, // Inclui os dados do cliente relacionado
        service: true, // Inclui os dados do serviço relacionado
      },
      orderBy: {
        startTime: 'asc', // Ordena os agendamentos por data de início
      },
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}
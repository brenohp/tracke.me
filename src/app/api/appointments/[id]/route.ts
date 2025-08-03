// Caminho: src/app/api/appointments/[id]/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { addMinutes } from 'date-fns';
import { NotificationService } from '@/lib/services/notification.service';

// Função para ATUALIZAR (EDITAR) um agendamento
export async function PUT(request: Request) {
  // Extrai o ID manualmente da URL, conforme solicitado
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  const appointmentId = pathnameParts[pathnameParts.indexOf('appointments') + 1];

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { serviceId, clientId, professionalId, startTime, status } = body;

    if (!serviceId || !clientId || !professionalId || !startTime || !status) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const appointmentToUpdate = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        service: { businessId: session.businessId }
      }
    });

    if (!appointmentToUpdate) {
      return NextResponse.json({ message: 'Agendamento não encontrado ou acesso negado.' }, { status: 404 });
    }
    
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ message: 'Serviço selecionado não é válido.' }, { status: 400 });
    }
    
    // Mantém a correção de fuso horário
    const localDateTimeStringWithOffset = `${startTime}-03:00`;
    const startTimeDate = new Date(localDateTimeStringWithOffset);
    
    const endTimeDate = addMinutes(startTimeDate, service.durationInMinutes);

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        startTime: startTimeDate,
        endTime: endTimeDate,
        status,
        clientId,
        serviceId,
        professionalId,
      },
    });

    if (updatedAppointment.status !== appointmentToUpdate.status) {
      try {
        const [client, professional] = await Promise.all([
          prisma.client.findUnique({ where: { id: updatedAppointment.clientId } }),
          prisma.user.findUnique({ where: { id: updatedAppointment.professionalId } })
        ]);

        if (client && professional) {
          NotificationService.appointmentStatusChanged(updatedAppointment, client, professional);
        }
      } catch (notificationError) {
        console.error("Falha ao disparar a notificação de mudança de status:", notificationError);
      }
    }

    revalidatePath('/dashboard/schedule');
    return NextResponse.json(updatedAppointment, { status: 200 });

  } catch (error) {
    console.error(`Erro ao atualizar agendamento ${appointmentId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função para EXCLUIR um agendamento
export async function DELETE(request: Request) {
  // Extrai o ID manualmente da URL, conforme solicitado
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  const appointmentId = pathnameParts[pathnameParts.indexOf('appointments') + 1];

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }
  
  try {
    const appointmentToDelete = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        service: { businessId: session.businessId }
      }
    });

    if (!appointmentToDelete) {
      return NextResponse.json({ message: 'Agendamento não encontrado ou acesso negado.' }, { status: 404 });
    }

    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    revalidatePath('/dashboard/schedule');
    return NextResponse.json({ message: 'Agendamento excluído com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error(`Erro ao excluir agendamento ${appointmentId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}
// Caminho: src/lib/services/notification.service.ts

import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher/server';
// 1. IMPORTAMOS OS ENUMS DO PRISMA
import { Appointment, AppointmentStatus, Client, NotificationType, User } from '@prisma/client';

const mapeamentoDeStatusParaMensagem: Record<AppointmentStatus, string> = {
  SCHEDULED: 'foi agendado',
  CONFIRMED: 'confirmou o agendamento',
  COMPLETED: 'finalizou o agendamento',
  CANCELED: 'cancelou o agendamento',
  NO_SHOW: 'não compareceu ao agendamento',
};

// 2. NOVA FUNÇÃO PARA MAPEAMENTO DE STATUS PARA TIPO DE NOTIFICAÇÃO
const getNotificationTypeFromStatus = (status: AppointmentStatus): NotificationType => {
  switch (status) {
    case 'CONFIRMED': return 'APPOINTMENT_CONFIRMED';
    case 'COMPLETED': return 'APPOINTMENT_COMPLETED';
    case 'CANCELED': return 'APPOINTMENT_CANCELED';
    default: return 'GENERIC';
  }
};

export const NotificationService = {
  
  async newAppointment(appointment: Appointment, client: Client, professional: User) {
    try {
      const businessOwner = await prisma.user.findFirst({
        where: { businessId: professional.businessId, role: 'OWNER' },
      });

      if (!businessOwner) {
        console.error(`[NotificationService] Dono do negócio (businessId: ${professional.businessId}) não encontrado.`);
        return;
      }
      
      const message = `Novo agendamento com ${client.name} para ${professional.name}.`;
      const url = `/dashboard/schedule`;
      const userIdToNotify = businessOwner.id;

      const newNotification = await prisma.notification.create({
        data: { 
          userId: userIdToNotify, 
          message, 
          url,
          // 3. DEFININDO O TIPO DA NOTIFICAÇÃO
          type: 'NEW_APPOINTMENT',
        },
      });

      const channel = `private-notifications-${userIdToNotify}`;
      const event = 'new-notification';
      await pusherServer.trigger(channel, event, newNotification);

    } catch (error) {
      console.error('[NotificationService] Falha ao enviar notificação de novo agendamento:', error);
    }
  },

  async appointmentStatusChanged(appointment: Appointment, client: Client, professional: User) {
    try {
      const businessOwner = await prisma.user.findFirst({
        where: { businessId: professional.businessId, role: 'OWNER' },
      });

      if (!businessOwner) {
        console.error(`[NotificationService] Dono do negócio (businessId: ${professional.businessId}) não encontrado.`);
        return;
      }

      const statusMessage = mapeamentoDeStatusParaMensagem[appointment.status] || `teve seu status atualizado para ${appointment.status}`;
      const message = `${client.name} ${statusMessage} com ${professional.name}.`;
      const url = `/dashboard/schedule`;
      const userIdToNotify = businessOwner.id;

      const newNotification = await prisma.notification.create({
        data: { 
          userId: userIdToNotify, 
          message, 
          url,
          // 4. DEFININDO O TIPO DA NOTIFICAÇÃO COM BASE NO STATUS
          type: getNotificationTypeFromStatus(appointment.status),
        },
      });

      const channel = `private-notifications-${userIdToNotify}`;
      const event = 'new-notification';
      await pusherServer.trigger(channel, event, newNotification);

    } catch (error) {
      console.error('[NotificationService] Falha ao enviar notificação de mudança de status:', error);
    }
  },
};
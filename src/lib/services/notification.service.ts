// Caminho: src/lib/services/notification.service.ts

import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher/server';
import { Appointment, AppointmentStatus, Client, NotificationType, User } from '@prisma/client';

const mapeamentoDeStatusParaMensagem: Record<AppointmentStatus, string> = {
  SCHEDULED: 'foi agendado',
  CONFIRMED: 'confirmou o agendamento',
  COMPLETED: 'finalizou o agendamento',
  CANCELED: 'cancelou o agendamento',
  NO_SHOW: 'não compareceu ao agendamento',
};

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
    // ... (código desta função permanece o mesmo)
    try {
      const businessOwner = await prisma.user.findFirst({
        where: { businessId: professional.businessId, role: 'OWNER' },
      });
      if (!businessOwner) { return; }
      const message = `Novo agendamento com ${client.name} para ${professional.name}.`;
      const url = `/dashboard/schedule`;
      const userIdToNotify = businessOwner.id;
      const newNotification = await prisma.notification.create({
        data: { userId: userIdToNotify, message, url, type: 'NEW_APPOINTMENT' },
      });
      const channel = `private-notifications-${userIdToNotify}`;
      const event = 'new-notification';
      await pusherServer.trigger(channel, event, newNotification);
    } catch (error) {
      console.error('[NotificationService] Falha ao enviar notificação de novo agendamento:', error);
    }
  },

  async appointmentStatusChanged(appointment: Appointment, client: Client, professional: User) {
    // ... (código desta função permanece o mesmo)
    try {
      const businessOwner = await prisma.user.findFirst({
        where: { businessId: professional.businessId, role: 'OWNER' },
      });
      if (!businessOwner) { return; }
      const statusMessage = mapeamentoDeStatusParaMensagem[appointment.status] || `teve seu status atualizado`;
      const message = `${client.name} ${statusMessage} com ${professional.name}.`;
      const url = `/dashboard/schedule`;
      const userIdToNotify = businessOwner.id;
      const newNotification = await prisma.notification.create({
        data: { userId: userIdToNotify, message, url, type: getNotificationTypeFromStatus(appointment.status) },
      });
      const channel = `private-notifications-${userIdToNotify}`;
      const event = 'new-notification';
      await pusherServer.trigger(channel, event, newNotification);
    } catch (error) {
      console.error('[NotificationService] Falha ao enviar notificação de mudança de status:', error);
    }
  },

  // ===================================================================
  // FUNÇÃO DE COMUNICADOS ATUALIZADA PARA ENVIAR PAYLOAD COMPLETO
  // ===================================================================
  async systemUpdate(message: string, targetPlanId: string | null) {
    try {
      const whereClause = {
        role: 'OWNER' as const,
        business: targetPlanId ? { planId: targetPlanId } : undefined,
      };

      const targetUsers = await prisma.user.findMany({
        where: whereClause,
        select: { id: true },
      });

      if (targetUsers.length === 0) {
        console.log('[NotificationService] Nenhum usuário encontrado para o comunicado.');
        return;
      }
      
      // 1. Criamos as notificações e obtemos os registros completos de volta
      const createdNotifications = await Promise.all(
        targetUsers.map(user => 
          prisma.notification.create({
            data: {
              userId: user.id,
              message,
              type: 'SYSTEM_UPDATE' as const,
            }
          })
        )
      );

      // 2. Preparamos os eventos para o Pusher com os dados completos
      const events = createdNotifications.map(notification => ({
        channel: `private-notifications-${notification.userId}`,
        name: 'new-notification',
        data: notification, // Agora 'data' contém o objeto completo com 'id' e 'createdAt'
      }));
      
      // 3. Usamos triggerBatch para eficiência
      await pusherServer.triggerBatch(events);

    } catch (error) {
      console.error('[NotificationService] Falha ao enviar comunicado do sistema:', error);
    }
  }
};
// Caminho: src/app/[subdomain]/dashboard/_components/NotificationBell.tsx
"use client";

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Bell, CalendarPlus, Check, XCircle, PartyPopper, AlertTriangle } from 'lucide-react';
import { pusherClient } from '@/lib/pusher/client';
import { useAuth } from '@/contexts/SessionProvider';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { NotificationType } from '@prisma/client';

type Notification = {
  id: string;
  message: string;
  read: boolean;
  url: string | null;
  userId: string;
  createdAt: string;
  type: NotificationType;
};

export function NotificationBell() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user?.id) return;
    // ... (código de busca inicial e inscrição no Pusher permanece o mesmo)
    const fetchInitialNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (!response.ok) throw new Error('Falha ao buscar notificações');
        const data: Notification[] = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error(error);
        toast.error('Não foi possível carregar as notificações.');
      }
    };
    fetchInitialNotifications();
    const channelName = `private-notifications-${user.id}`;
    try {
      const channel = pusherClient.subscribe(channelName);
      channel.bind('new-notification', (newNotification: Notification) => {
        setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
      });
      return () => {
        pusherClient.unsubscribe(channelName);
        channel.unbind('new-notification');
      };
    } catch (error) {
      console.error("Falha ao se inscrever no canal Pusher:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    // ... (código para fechar ao clicar fora permanece o mesmo)
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationRef]);

  const handleClearAll = async () => {
    // ... (código para limpar tudo permanece o mesmo)
    if (notifications.length === 0) return;
    try {
      await fetch('/api/notifications', { method: 'DELETE' });
      setNotifications([]);
      toast.success('Notificações limpas!');
    } catch {
      toast.error('Não foi possível limpar as notificações.');
    }
  };

  // ===================================================================
  // NOVA LÓGICA PARA MARCAR COMO LIDO AO ABRIR
  // ===================================================================
  const handleToggleDropdown = async () => {
    const isOpening = !isOpen;
    setIsOpen(isOpening);

    // Se estiver abrindo e houver notificações não lidas
    if (isOpening && unreadCount > 0) {
      try {
        // Atualiza o estado local imediatamente para o usuário ver a mudança
        const readNotifications = notifications.map(n => ({ ...n, read: true }));
        setNotifications(readNotifications);
        
        // Em paralelo, envia a requisição para o backend para persistir a mudança
        await fetch('/api/notifications/read', { method: 'POST' });

      } catch (error) {
        console.error("Falha ao marcar notificações como lidas:", error);
        // Se a API falhar, poderíamos reverter o estado, mas por simplicidade, apenas logamos.
      }
    }
  };

  const notificationIcons: Record<NotificationType, ReactNode> = {
    NEW_APPOINTMENT: <CalendarPlus className="h-5 w-5 text-blue-500" />,
    APPOINTMENT_CONFIRMED: <Check className="h-5 w-5 text-green-500" />,
    APPOINTMENT_CANCELED: <XCircle className="h-5 w-5 text-red-500" />,
    APPOINTMENT_COMPLETED: <PartyPopper className="h-5 w-5 text-purple-500" />,
    SYSTEM_UPDATE: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    GENERIC: <Bell className="h-5 w-5 text-gray-500" />,
  };

  return (
    <div className="relative" ref={notificationRef}>
      {/* O OnClick agora chama a nova função */}
      <button onClick={handleToggleDropdown} className="relative text-gray-600 hover:text-brand-primary focus:outline-none">
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <p className="text-sm font-semibold text-brand-primary">Notificações</p>
              {notifications.length > 0 && (
                <button onClick={handleClearAll} className="text-xs text-brand-accent hover:underline focus:outline-none">Limpar tudo</button>
              )}
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  // A classe agora é sempre de 'lido' porque atualizamos o estado ao abrir
                  <li key={notification.id} className="flex items-start gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex-shrink-0 mt-0.5">
                      {notificationIcons[notification.type] || notificationIcons.GENERIC}
                    </div>
                    <div>
                      <p className="leading-tight">{notification.message}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-8 text-sm text-center text-gray-500">Nenhuma notificação nova.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
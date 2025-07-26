// Caminho: src/app/[subdomain]/dashboard/_components/NotificationBell.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Bell, CalendarPlus, CheckCircle } from 'lucide-react';

type Notification = {
  id: number;
  type: 'new_appointment' | 'confirmation';
  message: string;
  time: string;
  read: boolean;
};

const mockNotifications: Notification[] = [
  { id: 1, type: 'new_appointment', message: 'Novo agendamento com Maria Silva às 14:00.', time: '2 min atrás', read: false },
  { id: 2, type: 'confirmation', message: 'João Pedro confirmou o agendamento de amanhã.', time: '1 hora atrás', read: false },
  { id: 3, type: 'confirmation', message: 'Ana Clara confirmou o agendamento de amanhã.', time: '3 horas atrás', read: true },
  { id: 4, type: 'new_appointment', message: 'Novo agendamento com Lucas Souza às 18:30.', time: '5 horas atrás', read: true },
];

export function NotificationBell() {
  // 1. Trazemos de volta o 'setNotifications' para poder alterar o estado
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);
  
  // 2. Nova função para limpar todas as notificações
  const handleClearAll = () => {
    setNotifications([]);
  };

  const notificationIcons = {
    new_appointment: <CalendarPlus className="h-5 w-5 text-blue-500" />,
    confirmation: <CheckCircle className="h-5 w-5 text-green-500" />,
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-600 hover:text-brand-primary focus:outline-none"
      >
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
            {/* 3. Cabeçalho atualizado com o botão */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <p className="text-sm font-semibold text-brand-primary">Notificações</p>
              {notifications.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="text-xs text-brand-accent hover:underline focus:outline-none"
                >
                  Limpar tudo
                </button>
              )}
            </div>
            {/* A barra de rolagem já está implementada com as classes abaixo */}
            <ul className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`flex items-start gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 ${!notification.read ? 'bg-brand-accent-light/30' : ''}`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {notificationIcons[notification.type]}
                    </div>
                    <div>
                      <p className="leading-tight">{notification.message}</p>
                      <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-8 text-sm text-center text-gray-500">
                  Nenhuma notificação nova.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
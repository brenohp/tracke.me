// Caminho: src/app/[subdomain]/dashboard/schedule/_components/ScheduleView.tsx
"use client";

import { useState } from 'react';
import ServiceModal from '../../services/_components/ServiceModal';
import AppointmentForm from './AppointmentForm';
import CalendarView from './CalendarView';
// CORREÇÃO: Importa o DateClickArg do plugin de interação
import { type DateClickArg } from '@fullcalendar/interaction';

// Tipos
interface Professional {
  id: string;
  name: string;
}
interface SerializableService {
  id: string;
  name: string;
  durationInMinutes: number;
}
interface SerializableClient {
  id: string;
  name: string;
}
interface ScheduleViewProps {
  services: SerializableService[];
  clients: SerializableClient[];
  professionals: Professional[];
}

export default function ScheduleView({ services, clients, professionals }: ScheduleViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  const handleDateClick = (arg: DateClickArg) => {
    const formattedDate = arg.dateStr.substring(0, 16);
    setSelectedDate(formattedDate);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">
          Agenda
        </h1>
        <button 
          className="px-4 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90"
          onClick={() => {
            setSelectedDate(undefined);
            setIsModalOpen(true);
          }}
        >
          + Novo Agendamento
        </button>
      </div>

      <CalendarView onDateClick={handleDateClick} />

      <ServiceModal
        title="Novo Agendamento"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <AppointmentForm 
          services={services}
          clients={clients}
          professionals={professionals}
          initialStartTime={selectedDate}
          onSuccess={() => setIsModalOpen(false)}
        />
      </ServiceModal>
    </div>
  );
}
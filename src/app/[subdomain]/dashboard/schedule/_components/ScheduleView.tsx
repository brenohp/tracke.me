// Caminho: src/app/[subdomain]/dashboard/schedule/_components/ScheduleView.tsx
"use client";

import { useState, useRef } from 'react'; // 1. Importa o useRef
import ServiceModal from '../../services/_components/ServiceModal';
import AppointmentForm from './AppointmentForm';
import CalendarView from './CalendarView';
import AppointmentsTable from './AppointmentsTable';
import { type EventClickArg } from '@fullcalendar/core';
import { type DateClickArg } from '@fullcalendar/interaction';
import { toast } from 'react-hot-toast';

// Tipos
interface Professional { id: string; name: string; }
interface SerializableService { id: string; name: string; durationInMinutes: number; }
interface SerializableClient { id: string; name: string; }
interface AppointmentData { id: string; clientId: string; serviceId: string; professionalId: string; startTime: string; status: string; }
interface ScheduleViewProps {
  services: SerializableService[];
  clients: SerializableClient[];
  professionals: Professional[];
}

export default function ScheduleView({ services, clients, professionals }: ScheduleViewProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [appointmentToEdit, setAppointmentToEdit] = useState<AppointmentData | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<AppointmentData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tableRefreshTrigger, setTableRefreshTrigger] = useState(0);

  // 2. Cria a ref para o nosso componente de calendário
  const calendarRef = useRef<{ refetchEvents: () => void }>(null);

  const handleDateClick = (arg: DateClickArg) => {
    const formattedDate = arg.dateStr.substring(0, 16);
    setSelectedDate(formattedDate);
    setAppointmentToEdit(null);
    setIsCreateModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const appointmentData: AppointmentData = {
      id: event.id,
      clientId: event.extendedProps.clientId,
      serviceId: event.extendedProps.serviceId,
      professionalId: event.extendedProps.professionalId,
      startTime: event.startStr,
      status: event.extendedProps.status,
    };
    setIsCreateModalOpen(false);
    setAppointmentToEdit(appointmentData);
  };

  // 3. Função de sucesso agora atualiza a tabela E o calendário
  const handleSuccess = () => {
    setIsCreateModalOpen(false);
    setAppointmentToEdit(null);
    setTableRefreshTrigger(prev => prev + 1);
    calendarRef.current?.refetchEvents(); // Atualiza o calendário
  };

  const handleDeleteAppointment = async () => {
    if (!appointmentToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/appointments/${appointmentToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao excluir.');
      }
      toast.success('Agendamento excluído com sucesso!');
      setAppointmentToDelete(null);
      handleSuccess(); // Usa a função de sucesso para atualizar tudo
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error('Ocorreu um erro ao excluir.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">Agenda</h1>
        <button className="px-4 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90" onClick={() => { setAppointmentToEdit(null); setSelectedDate(undefined); setIsCreateModalOpen(true); }}>
          + Novo Agendamento
        </button>
      </div>

      {/* 4. Passa a ref para o CalendarView */}
      <CalendarView ref={calendarRef} onDateClick={handleDateClick} onEventClick={handleEventClick} />
      
      <div className="mt-8">
        <AppointmentsTable refreshTrigger={tableRefreshTrigger} services={services} clients={clients} professionals={professionals} />
      </div>

      <ServiceModal title="Novo Agendamento" isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <AppointmentForm services={services} clients={clients} professionals={professionals} initialData={null} initialStartTime={selectedDate} onSuccess={handleSuccess} />
      </ServiceModal>
      
      <ServiceModal title="Editar Agendamento" isOpen={!!appointmentToEdit} onClose={() => setAppointmentToEdit(null)}>
        <AppointmentForm services={services} clients={clients} professionals={professionals} initialData={appointmentToEdit} onSuccess={handleSuccess} 
          // 5. Lógica do botão de excluir no modal de edição CORRIGIDA
          onDelete={() => {
            setAppointmentToDelete(appointmentToEdit);
            setAppointmentToEdit(null);
          }}
        />
      </ServiceModal>

      <ServiceModal title="Confirmar Exclusão" isOpen={!!appointmentToDelete} onClose={() => setAppointmentToDelete(null)}>
        <div>
          <p className="text-gray-700">Tem a certeza que deseja excluir este agendamento?</p>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" className="px-4 py-2" onClick={() => setAppointmentToDelete(null)} disabled={isDeleting}>Cancelar</button>
            <button type="button" className="px-4 py-2 bg-red-600 text-white rounded-lg" onClick={handleDeleteAppointment} disabled={isDeleting}>
              {isDeleting ? 'A excluir...' : 'Sim, excluir'}
            </button>
          </div>
        </div>
      </ServiceModal>
    </div>
  );
}
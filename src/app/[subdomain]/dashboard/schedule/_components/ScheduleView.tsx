// Caminho: src/app/[subdomain]/dashboard/schedule/_components/ScheduleView.tsx
"use client";

import { useState } from 'react';
import ServiceModal from '../../services/_components/ServiceModal';
import AppointmentForm from './AppointmentForm'; // 1. Importa o nosso novo formulário

// Definindo os tipos para os dados que recebemos da página de servidor
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
  // Estado para controlar o modal de criação de agendamento
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">
          Agenda
        </h1>
        <button 
          className="px-4 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90"
          onClick={() => setIsModalOpen(true)}
        >
          + Novo Agendamento
        </button>
      </div>

      {/* Placeholder para o Calendário */}
      <div className="bg-white rounded-lg shadow p-6 min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-400">O calendário de agendamentos aparecerá aqui.</p>
      </div>

      {/* Modal para criar um novo agendamento */}
      <ServiceModal
        title="Novo Agendamento"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {/* 2. Renderiza o formulário e passa os dados necessários */}
        <AppointmentForm 
          services={services}
          clients={clients}
          professionals={professionals}
          onSuccess={() => setIsModalOpen(false)}
        />
      </ServiceModal>
    </div>
  );
}
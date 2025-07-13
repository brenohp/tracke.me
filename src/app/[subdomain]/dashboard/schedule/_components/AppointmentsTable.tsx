// Caminho: src/app/[subdomain]/dashboard/schedule/_components/AppointmentsTable.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { FilePenLine, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

import ServiceModal from '../../services/_components/ServiceModal';
import AppointmentForm from './AppointmentForm'; 

// Tipos
interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  client: { name: string };
  service: { name: string };
  professional: { name: string };
  clientId: string;
  serviceId: string;
  professionalId: string;
}

interface SelectOption {
  id: string;
  name: string;
}

interface AppointmentsTableProps {
  services: SelectOption[];
  clients: SelectOption[];
  professionals: SelectOption[];
  refreshTrigger: number;
}

// 1. Objeto para mapear status para estilos e traduções
const statusStyles: { [key: string]: { text: string; classes: string } } = {
  SCHEDULED: { text: 'Agendado', classes: 'bg-blue-100 text-blue-800' },
  CONFIRMED: { text: 'Confirmado', classes: 'bg-green-100 text-green-800' },
  COMPLETED: { text: 'Finalizado', classes: 'bg-gray-200 text-gray-800' },
  CANCELED: { text: 'Cancelado', classes: 'bg-red-100 text-red-800' },
  NO_SHOW: { text: 'Não Compareceu', classes: 'bg-yellow-100 text-yellow-800' },
};

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}

export default function AppointmentsTable({ services, clients, professionals, refreshTrigger }: AppointmentsTableProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/appointments?search=${debouncedSearchTerm}`);
      if (!response.ok) throw new Error('Falha ao buscar agendamentos');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar os agendamentos.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments, refreshTrigger]);

  const handleConfirmDelete = async () => {
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
      fetchAppointments();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error('Ocorreu um erro ao excluir.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-primary">Histórico de Agendamentos</h2>
          <input 
            type="text"
            placeholder="Pesquisar por cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xs border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente / Serviço</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data e Hora</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profissional</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={5} className="p-4 text-center">A carregar...</td></tr>
              ) : appointments.length > 0 ? (
                appointments.map((apt) => {
                  // 2. Pega o estilo e texto corretos para o status atual
                  const statusInfo = statusStyles[apt.status] || { text: apt.status, classes: 'bg-gray-100 text-gray-800' };
                  return (
                    <tr key={apt.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{apt.client.name}</div>
                        <div className="text-sm text-gray-500">{apt.service.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(apt.startTime), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apt.professional.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* 3. Aplica as classes e o texto dinâmicos */}
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.classes}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center justify-center gap-4">
                          <button onClick={() => setAppointmentToEdit(apt)} aria-label="Editar agendamento" title="Editar agendamento" className="text-brand-accent hover:text-brand-accent-light">
                            <FilePenLine className="h-5 w-5" />
                          </button>
                          <button onClick={() => setAppointmentToDelete(apt)} aria-label="Excluir agendamento" title="Excluir agendamento" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={5} className="p-4 text-center">Nenhum agendamento encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ServiceModal title="Editar Agendamento" isOpen={!!appointmentToEdit} onClose={() => setAppointmentToEdit(null)}>
        <AppointmentForm 
          services={services}
          clients={clients}
          professionals={professionals}
          initialData={appointmentToEdit}
          onSuccess={() => {
            setAppointmentToEdit(null);
            fetchAppointments();
          }}
        />
      </ServiceModal>

      <ServiceModal title="Confirmar Exclusão" isOpen={!!appointmentToDelete} onClose={() => setAppointmentToDelete(null)}>
        <div>
          <p className="text-gray-700">
            Tem a certeza que deseja excluir o agendamento de <strong className="font-semibold text-brand-primary">{appointmentToDelete?.client.name}</strong>?
          </p>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" className="px-4 py-2" onClick={() => setAppointmentToDelete(null)} disabled={isDeleting}>
              Cancelar
            </button>
            <button type="button" className="px-4 py-2 bg-red-600 text-white rounded-lg" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'A excluir...' : 'Sim, excluir'}
            </button>
          </div>
        </div>
      </ServiceModal>
    </>
  );
}
// Caminho: src/app/[subdomain]/dashboard/schedule/_components/AppointmentForm.tsx
"use client";

import { useState, useEffect, type FormEvent, useRef } from 'react';
import { toast } from 'react-hot-toast';

// Tipos
interface SelectOption {
  id: string;
  name: string;
}

interface AppointmentData {
    id: string;
    clientId: string;
    serviceId: string;
    professionalId: string;
    startTime: string;
    status: string;
}

interface AppointmentFormProps {
  services: SelectOption[];
  clients: SelectOption[];
  professionals: SelectOption[];
  initialData?: AppointmentData | null;
  initialStartTime?: string; 
  onSuccess?: () => void;
  onDelete?: () => void;
}

export default function AppointmentForm({ 
  services, 
  clients, 
  professionals, 
  initialData, 
  initialStartTime, 
  onSuccess,
  onDelete
}: AppointmentFormProps) {
  
  const [clientId, setClientId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [professionalId, setProfessionalId] = useState('');
  const [startTime, setStartTime] = useState(initialStartTime || '');
  const [status, setStatus] = useState('SCHEDULED');
  const [isLoading, setIsLoading] = useState(false);

  // --- ESTADOS PARA A PESQUISA DE CLIENTES (CORRIGIDO) ---
  const [clientSearch, setClientSearch] = useState('');
  // O estado 'selectedClientName' foi removido por ser redundante
  const [filteredClients, setFilteredClients] = useState<SelectOption[]>([]);
  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const clientSearchRef = useRef<HTMLDivElement>(null);

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setClientId(initialData.clientId);
      setServiceId(initialData.serviceId);
      setProfessionalId(initialData.professionalId);
      setStartTime(initialData.startTime.substring(0, 16));
      setStatus(initialData.status);
      const clientName = clients.find(c => c.id === initialData.clientId)?.name || '';
      setClientSearch(clientName);
    } else {
      resetForm();
      setStartTime(initialStartTime || '');
    }
  }, [initialData, initialStartTime, clients]);

  useEffect(() => {
    if (clientSearch) {
      setFilteredClients(
        clients.filter(client =>
          client.name.toLowerCase().includes(clientSearch.toLowerCase())
        )
      );
    } else {
      setFilteredClients(clients);
    }
  }, [clientSearch, clients]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (clientSearchRef.current && !clientSearchRef.current.contains(event.target as Node)) {
        setIsClientListOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clientSearchRef]);
  
  const resetForm = () => {
    setClientId('');
    setServiceId('');
    setProfessionalId('');
    setStartTime('');
    setStatus('SCHEDULED');
    setClientSearch('');
  }

  const handleClientSelect = (client: SelectOption) => {
    setClientId(client.id);
    setClientSearch(client.name);
    setIsClientListOpen(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!clientId) {
      toast.error('Por favor, selecione um cliente da lista.');
      return;
    }
    setIsLoading(true);
    
    const appointmentData = { clientId, serviceId, professionalId, startTime, status };
    const url = isEditing ? `/api/appointments/${initialData?.id}` : '/api/appointments';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao guardar o agendamento.');
      }

      toast.success(isEditing ? 'Agendamento atualizado!' : 'Agendamento criado!');
      
      if (!isEditing) resetForm();
      if (onSuccess) onSuccess();

    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error('Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="relative" ref={clientSearchRef}>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">Cliente</label>
          <input
            type="text"
            id="client"
            value={clientSearch}
            onChange={(e) => {
              setClientSearch(e.target.value);
              setClientId('');
              setIsClientListOpen(true);
            }}
            onFocus={() => setIsClientListOpen(true)}
            placeholder="Digite para pesquisar um cliente..."
            required
            autoComplete="off"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"
          />
          {isClientListOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <div
                    key={client.id}
                    onClick={() => handleClientSelect(client)}
                    className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                  >
                    {client.name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">Nenhum cliente encontrado.</div>
              )}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700">Serviço</label>
          <select id="service" value={serviceId} onChange={(e) => setServiceId(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent">
            <option value="" disabled>Selecione um serviço</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="professional" className="block text-sm font-medium text-gray-700">Profissional</label>
          <select id="professional" value={professionalId} onChange={(e) => setProfessionalId(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent">
            <option value="" disabled>Selecione um profissional</option>
            {professionals.map(prof => (
              <option key={prof.id} value={prof.id}>{prof.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Data e Hora</label>
          <input 
            type="datetime-local" 
            id="startTime" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
            required 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"
          />
        </div>

        {isEditing && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select 
              id="status" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="SCHEDULED">Agendado</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="COMPLETED">Finalizado</option>
              <option value="CANCELED">Cancelado</option>
            </select>
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <div>
            {isEditing && (
              <button 
                type="button"
                onClick={onDelete} 
                className="px-4 py-2 font-semibold text-red-600 bg-transparent rounded-lg hover:bg-red-50"
              >
                Excluir Agendamento
              </button>
            )}
          </div>
          
          <button type="submit" disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
            {isLoading ? 'A guardar...' : (isEditing ? 'Salvar Alterações' : 'Confirmar Agendamento')}
          </button>
        </div>
      </form>
    </div>
  );
}
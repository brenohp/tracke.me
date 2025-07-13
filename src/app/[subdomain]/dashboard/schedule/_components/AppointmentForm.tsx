// Caminho: src/app/[subdomain]/dashboard/schedule/_components/AppointmentForm.tsx
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';

// Tipos para os dados que o formulário recebe
interface SelectOption {
  id: string;
  name: string;
}

interface AppointmentFormProps {
  services: SelectOption[];
  clients: SelectOption[];
  professionals: SelectOption[];
  initialStartTime?: string; // Prop para a data inicial
  onSuccess?: () => void;
}

export default function AppointmentForm({ services, clients, professionals, initialStartTime, onSuccess }: AppointmentFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Estados para controlar os campos do formulário
  const [clientId, setClientId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [professionalId, setProfessionalId] = useState('');
  const [startTime, setStartTime] = useState(initialStartTime || '');
  const [isLoading, setIsLoading] = useState(false);

  // useEffect para atualizar a data se o usuário clicar noutra data
  useEffect(() => {
    if (initialStartTime) {
      setStartTime(initialStartTime);
    }
  }, [initialStartTime]);

  const resetForm = () => {
    setClientId('');
    setServiceId('');
    setProfessionalId('');
    setStartTime('');
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          serviceId,
          professionalId,
          startTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar o agendamento.');
      }

      toast.success('Agendamento criado com sucesso!');
      resetForm();
      router.push(pathname);
      
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleção de Cliente */}
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">Cliente</label>
          <select id="client" value={clientId} onChange={(e) => setClientId(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent">
            <option value="" disabled>Selecione um cliente</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

        {/* Seleção de Serviço */}
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700">Serviço</label>
          <select id="service" value={serviceId} onChange={(e) => setServiceId(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent">
            <option value="" disabled>Selecione um serviço</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
        </div>

        {/* Seleção de Profissional */}
        <div>
          <label htmlFor="professional" className="block text-sm font-medium text-gray-700">Profissional</label>
          <select id="professional" value={professionalId} onChange={(e) => setProfessionalId(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent">
            <option value="" disabled>Selecione um profissional</option>
            {professionals.map(prof => (
              <option key={prof.id} value={prof.id}>{prof.name}</option>
            ))}
          </select>
        </div>

        {/* Seleção de Data e Hora */}
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Data e Hora do Agendamento</label>
          <input 
            type="datetime-local" 
            id="startTime" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
            required 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
            {isLoading ? 'A agendar...' : 'Confirmar Agendamento'}
          </button>
        </div>
      </form>
    </div>
  );
}
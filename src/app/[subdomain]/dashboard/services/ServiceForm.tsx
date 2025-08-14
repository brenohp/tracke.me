// Caminho: src/app/[subdomain]/dashboard/servicos/ServiceForm.tsx
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type Professional = {
  id: string;
  name: string;
};

interface SerializableService {
    id: string;
    name: string;
    description: string | null;
    durationInMinutes: number;
    price: string;
    status: string;
    professionals: Professional[];
}

interface ServiceFormProps {
  professionals: Professional[];
  initialData?: SerializableService | null;
  onSuccess?: () => void;
}

export default function ServiceForm({ professionals, initialData, onSuccess }: ServiceFormProps) {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([]);
  const [status, setStatus] = useState('ACTIVE');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setDuration(initialData.durationInMinutes.toString());
      setPrice(initialData.price);
      setSelectedProfessionals(initialData.professionals.map(p => p.id));
      setStatus(initialData.status);
    }
  }, [initialData]);

  const handleProfessionalChange = (professionalId: string) => {
    setSelectedProfessionals((prev) =>
      prev.includes(professionalId)
        ? prev.filter((id) => id !== professionalId)
        : [...prev, professionalId]
    );
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setDuration('');
    setPrice('');
    setSelectedProfessionals([]);
    setStatus('ACTIVE');
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    const isEditing = !!initialData;

    const serviceData = {
      name,
      description,
      durationInMinutes: Number(duration),
      price: Number(price),
      professionals: selectedProfessionals,
      status,
    };
    
    const url = isEditing ? `/api/services/${initialData?.id}` : '/api/services';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao guardar o serviço.');
      }

      toast.success(isEditing ? 'Serviço atualizado com sucesso!' : 'Serviço criado com sucesso!');
      
      if (!isEditing) {
        resetForm();
      }
      
      // A linha crucial para a correção:
      router.refresh();
      
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Serviço</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duração (em minutos)</label>
            <input type="number" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
            <input type="number" step="0.01" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent">
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Profissionais que realizam este serviço</label>
          <div className="mt-2 space-y-2">
            {professionals.map((prof) => (
              <label key={prof.id} className="flex items-center">
                <input type="checkbox" checked={selectedProfessionals.includes(prof.id)} onChange={() => handleProfessionalChange(prof.id)} className="h-4 w-4 text-brand-accent border-gray-300 rounded focus:ring-brand-accent"/>
                <span className="ml-2 text-sm text-gray-600">{prof.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
            {isLoading ? 'A guardar...' : (initialData ? 'Salvar Alterações' : 'Criar Serviço')}
          </button>
        </div>
      </form>
    </div>
  );
}
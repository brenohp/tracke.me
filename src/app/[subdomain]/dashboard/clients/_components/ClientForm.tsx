// Caminho: src/app/[subdomain]/dashboard/clientes/_components/ClientForm.tsx
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';

// Tipo para os dados de um cliente que o formulário pode receber
interface SerializableClient {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  observations: string | null;
}

interface ClientFormProps {
  initialData?: SerializableClient | null; // Prop opcional para dados iniciais (modo edição)
  onSuccess?: () => void;
}

export default function ClientForm({ initialData, onSuccess }: ClientFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Estados para controlar os campos do formulário
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [observations, setObservations] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // useEffect para preencher o formulário quando estiver no modo de edição
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
      setObservations(initialData.observations || '');
    }
  }, [initialData]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setObservations('');
  }

  // handleSubmit agora lida com criar (POST) e editar (PUT)
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    const isEditing = !!initialData; // Verifica se estamos a editar ou a criar

    const clientData = {
      name,
      phone,
      email,
      observations,
    };
    
    const url = isEditing ? `/api/clients/${initialData.id}` : '/api/clients';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao guardar o cliente.');
      }

      toast.success(isEditing ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!');
      
      if (!isEditing) {
        resetForm();
      }
      
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
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone (Opcional)</label>
            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Opcional)</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" />
          </div>
        </div>

        <div>
          <label htmlFor="observations" className="block text-sm font-medium text-gray-700">Observações (Opcional)</label>
          <textarea id="observations" value={observations} onChange={(e) => setObservations(e.target.value)} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"></textarea>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
            {isLoading ? 'A guardar...' : (initialData ? 'Salvar Alterações' : 'Guardar Cliente')}
          </button>
        </div>
      </form>
    </div>
  );
}
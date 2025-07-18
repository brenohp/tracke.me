// Caminho: src/app/admin/plans/_components/PlanForm.tsx
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Tipo para os dados iniciais (para quando formos editar)
interface PlanData {
  id?: string;
  name: string;
  description: string | null;
  price: string;
  features: string; // Virá como string JSON
  active: boolean;
}

interface PlanFormProps {
  onSuccess?: () => void;
  initialData?: PlanData | null;
}

export default function PlanForm({ onSuccess, initialData }: PlanFormProps) {
  const router = useRouter();
  
  // Estados para controlar os campos do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState('');
  const [active, setActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setPrice(initialData.price);
      // Converte o array JSON de volta para uma string de texto para o textarea
      try {
        const featuresArray = JSON.parse(initialData.features);
        setFeatures(featuresArray.join('\n'));
      } catch {
        setFeatures('');
      }
      setActive(initialData.active);
    }
  }, [initialData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Converte as funcionalidades (uma por linha) para um array JSON
    const featuresArray = features.split('\n').filter(feat => feat.trim() !== '');

    try {
      const planData = {
        name,
        description,
        price: Number(price),
        features: featuresArray,
        active,
      };

      const url = isEditing ? `/api/admin/plans/${initialData?.id}` : '/api/admin/plans';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao guardar o plano.');
      }

      toast.success(isEditing ? 'Plano atualizado com sucesso!' : 'Plano criado com sucesso!');
      router.refresh(); // Força a atualização dos dados na página de listagem
      
      if (onSuccess) {
        onSuccess(); // Fecha o modal
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Plano</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço Mensal (ex: 49.90)</label>
            <input type="number" step="0.01" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label>
          <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>

        <div>
          <label htmlFor="features" className="block text-sm font-medium text-gray-700">Funcionalidades (uma por linha)</label>
          <textarea id="features" value={features} onChange={(e) => setFeatures(e.target.value)} rows={5} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
        </div>

        <div className="flex items-center">
            <input type="checkbox" id="active" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 text-brand-accent border-gray-300 rounded"/>
            <label htmlFor="active" className="ml-2 block text-sm text-gray-900">Plano Ativo</label>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
            {isLoading ? 'A guardar...' : (isEditing ? 'Salvar Alterações' : 'Criar Plano')}
          </button>
        </div>
      </form>
    </div>
  );
}
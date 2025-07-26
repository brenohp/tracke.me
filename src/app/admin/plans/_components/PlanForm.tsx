// Caminho: src/app/admin/plans/_components/PlanForm.tsx
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface PlanPermissions {
  hasPackages: boolean;
  hasBilling: boolean;
  hasInventory: boolean;
  hasAutomation: boolean;
  hasMarketing: boolean;
  hasReports: boolean;
}

interface PlanData {
  id?: string;
  name: string;
  description: string | null;
  price: string;
  features: string;
  permissions?: string;
  active: boolean;
}

interface PlanFormProps {
  onSuccess?: () => void;
  initialData?: PlanData | null;
}

const initialPermissions: PlanPermissions = {
  hasPackages: false,
  hasBilling: false,
  hasInventory: false,
  hasAutomation: false,
  hasMarketing: false,
  hasReports: false,
};

export default function PlanForm({ onSuccess, initialData }: PlanFormProps) {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState('');
  const [active, setActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState<PlanPermissions>(initialPermissions);

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setPrice(initialData.price);
      setActive(initialData.active);

      try {
        const featuresArray = JSON.parse(initialData.features);
        setFeatures(featuresArray.join('\n'));
      } catch {
        setFeatures('');
      }
      
      try {
        if (initialData.permissions) {
          const parsedPermissions = JSON.parse(initialData.permissions);
          setPermissions({ ...initialPermissions, ...parsedPermissions });
        } else {
          setPermissions(initialPermissions);
        }
      } catch {
        setPermissions(initialPermissions);
      }

    } else {
      setName('');
      setDescription('');
      setPrice('');
      setFeatures('');
      setActive(true);
      setPermissions(initialPermissions);
    }
  }, [initialData]);

  const handlePermissionChange = (key: keyof PlanPermissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    const featuresArray = features.split('\n').filter(feat => feat.trim() !== '');

    try {
      const planData = {
        name,
        description,
        price: Number(price),
        features: featuresArray,
        permissions,
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
          <label htmlFor="features" className="block text-sm font-medium text-gray-700">Funcionalidades para Página de Preços (uma por linha)</label>
          <textarea id="features" value={features} onChange={(e) => setFeatures(e.target.value)} rows={4} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Permissões do Plano (para o Dashboard)</label>
          <div className="mt-2 space-y-2 p-4 border border-gray-300 rounded-md">
            {(Object.keys(permissions) as Array<keyof PlanPermissions>).map((permissionKey) => {
              const labels = {
                hasPackages: "Habilitar Módulo de Pacotes",
                hasBilling: "Habilitar Módulo de Faturamento",
                hasInventory: "Habilitar Módulo de Estoque",
                hasAutomation: "Habilitar Módulo de Automação IA",
                hasMarketing: "Habilitar Módulo de Marketing",
                hasReports: "Habilitar Módulo de Relatórios/Análise"
              };

              return (
                <div key={permissionKey} className="flex items-center">
                  <input
                    type="checkbox"
                    id={permissionKey}
                    // A CORREÇÃO FOI AQUI: Acessando a propriedade de um objeto
                    checked={permissions[permissionKey]}
                    onChange={() => handlePermissionChange(permissionKey)}
                    className="h-4 w-4 text-brand-accent border-gray-300 rounded"
                  />
                  <label htmlFor={permissionKey} className="ml-2 block text-sm text-gray-900">
                    {labels[permissionKey]}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center">
            <input type="checkbox" id="active" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 text-brand-accent border-gray-300 rounded"/>
            <label htmlFor="active" className="ml-2 block text-sm text-gray-900">Plano Ativo (visível na página de preços)</label>
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
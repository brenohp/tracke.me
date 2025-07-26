// Caminho: src/app/admin/businesses/_components/ChangePlanForm.tsx
"use client";

import { useState, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';

// Tipagem simplificada para os planos no dropdown
interface PlanSummary {
  id: string;
  name: string;
}

// Props que o nosso formulário receberá
interface ChangePlanFormProps {
  businessId: string;
  currentPlanId: string | null;
  allPlans: PlanSummary[];
  onSuccess: () => void; // Função para ser chamada em caso de sucesso (ex: fechar o modal)
}

export default function ChangePlanForm({
  businessId,
  currentPlanId,
  allPlans,
  onSuccess,
}: ChangePlanFormProps) {
  // Estado para controlar o plano selecionado no dropdown
  const [selectedPlanId, setSelectedPlanId] = useState(currentPlanId || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!selectedPlanId) {
      toast.error('Por favor, selecione um plano.');
      setIsLoading(false);
      return;
    }

    try {
      // Chamada para a API que criamos no passo anterior
      const response = await fetch(`/api/admin/businesses/${businessId}/change-plan`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPlanId: selectedPlanId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao alterar o plano.');
      }

      toast.success('Plano alterado com sucesso!');
      
      // Executa a função de callback (fechará o modal)
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="plan-select" className="block text-sm font-medium text-gray-700">
          Selecione o novo plano para este negócio:
        </label>
        <select
          id="plan-select"
          value={selectedPlanId}
          onChange={(e) => setSelectedPlanId(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm rounded-md"
        >
          <option value="" disabled>-- Escolha um plano --</option>
          {allPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90 disabled:bg-gray-400"
        >
          {isLoading ? 'A guardar...' : 'Salvar Alteração'}
        </button>
      </div>
    </form>
  );
}
// Caminho: src/app/admin/communication/_components/CommunicationView.tsx
"use client";

import { useState, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';

interface Plan {
  id: string;
  name: string;
}

interface CommunicationViewProps {
  plans: Plan[];
}

export function CommunicationView({ plans }: CommunicationViewProps) {
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all'); // 'all' ou o ID de um plano
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) {
      toast.error('A mensagem não pode estar vazia.');
      return;
    }
    setIsLoading(true);

    try {
      // No próximo passo, criaremos esta rota de API
      const response = await fetch('/api/admin/communication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, targetPlanId: target === 'all' ? null : target }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao enviar o comunicado.');
      }

      toast.success('Comunicado enviado com sucesso!');
      setMessage(''); // Limpa o campo de mensagem
      setTarget('all'); // Reseta o seletor

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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Mensagem do Comunicado
          </label>
          <textarea
            id="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"
            placeholder="Ex: Olá! Teremos uma manutenção agendada para este domingo às 23h. O sistema pode ficar indisponível por alguns minutos."
          />
        </div>

        <div>
          <label htmlFor="target" className="block text-sm font-medium text-gray-700">
            Enviar Para
          </label>
          <select
            id="target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"
          >
            <option value="all">Todos os Negócios</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                Apenas para o plano: {plan.name}
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
            {isLoading ? 'A enviar...' : 'Enviar Comunicado'}
          </button>
        </div>
      </form>
    </div>
  );
}
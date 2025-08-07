// src/app/[subdomain]/dashboard/settings/billing/_components/BillingClientView.tsx

"use client";

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';

interface PlanData {
  name: string;
  price: string;
  features: string; // Vem como uma string JSON
}

interface BillingClientViewProps {
  plan: PlanData;
}

export default function BillingClientView({ plan }: BillingClientViewProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Transforma a string de features em uma lista (array)
  const featuresList: string[] = JSON.parse(plan.features || '[]');

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      // Chama a nossa API para criar a sessão do portal
      const response = await fetch('/api/customer-portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (!data.success || !data.url) {
        throw new Error(data.message || 'Não foi possível carregar o portal do cliente.');
      }

      // Redireciona o usuário para a URL do portal da Stripe
      window.location.href = data.url;

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocorreu um erro inesperado.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl font-bold text-brand-primary">Seu Plano Atual</h2>
          <p className="text-lg text-brand-accent mt-1">
            <span className="font-bold">{plan.name}</span> - R$ {plan.price} / mês
          </p>
        </div>
        <Button 
          onClick={handleManageSubscription}
          disabled={isLoading}
          className="mt-4 md:mt-0"
        >
          {isLoading ? 'Carregando...' : 'Gerenciar Assinatura'}
        </Button>
      </div>

      <hr className="my-6" />

      <div>
        <h3 className="text-md font-semibold text-brand-primary mb-3">Benefícios do seu plano:</h3>
        <ul className="space-y-2 text-gray-600">
          {featuresList.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
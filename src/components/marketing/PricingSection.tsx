// Caminho: src/components/marketing/PricingSection.tsx
"use client";

import Link from 'next/link';
import { Check } from 'lucide-react';
import type { SerializablePlan } from '@/app/page';

interface PricingSectionProps {
  plans: SerializablePlan[];
}

export default function PricingSection({ plans }: PricingSectionProps) {
  const renderPlanCard = (plan: SerializablePlan) => {
    const featuresList: string[] = JSON.parse(plan.features);
    const isPopular = plan.name.toLowerCase().includes('essentials');

    // ===================================================================
    // NOVA LÓGICA PARA SEPARAR REAIS E CENTAVOS
    // ===================================================================
    const priceParts = plan.price.split('.');
    const integerPart = priceParts[0];
    const decimalPart = priceParts[1] || '00';
    // ===================================================================

    return (
      <div 
        key={plan.id} 
        className={`bg-white p-8 rounded-xl shadow-lg border flex flex-col relative ${isPopular ? 'border-2 border-brand-accent' : ''}`}
      >
        {isPopular && (
          <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
            <span className="bg-brand-accent text-white text-xs font-bold uppercase px-3 py-1 rounded-full">Mais Popular</span>
          </div>
        )}
        <h3 className="text-2xl font-bold text-brand-primary">{plan.name}</h3>
        {plan.description && <p className="mt-2 text-gray-500">{plan.description}</p>}
        
        {/* =================================================================== */}
        {/* CÓDIGO JSX ATUALIZADO PARA EXIBIR O PREÇO CORRETAMENTE             */}
        {/* =================================================================== */}
        <p className="text-5xl font-bold my-6">
          R$ {integerPart}
          <span className="text-lg font-normal text-gray-500">,{decimalPart}/mês</span>
        </p>
        
        <ul className="space-y-4 text-left flex-grow">
          {featuresList.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0"/>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link 
          href="/signup"
          className="block w-full mt-8 bg-brand-accent text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all text-center"
        >
          Começar Agora
        </Link>
      </div>
    );
  };

  return (
    <section id="pricing" className="py-20 bg-brand-background">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Um plano para cada fase do seu negócio.</h2>
        <p className="mt-4 text-lg text-gray-600">Escolha o plano ideal para você. Cancele quando quiser.</p>
        
        <div className="grid lg:grid-cols-3 gap-8 mt-12 max-w-7xl mx-auto">
          {plans.length > 0 ? (
            plans.map(renderPlanCard)
          ) : (
            <p className="col-span-3 text-gray-600">Nenhum plano disponível no momento. Volte em breve!</p>
          )}
        </div>
      </div>
    </section>
  );
}
// src/app/[subdomain]/dashboard/_components/OnboardingGuide.tsx
"use client";

import Link from 'next/link';
import { CheckCircle, CircleDashed } from 'lucide-react';

interface OnboardingGuideProps {
  completedSteps: {
    hasServices: boolean;
    hasClients: boolean;
    hasAvailability: boolean;
  };
}

interface Step {
  key: keyof OnboardingGuideProps['completedSteps'];
  title: string;
  description: string;
  link: string;
  linkText: string;
}

const steps: Step[] = [
  {
    key: 'hasAvailability',
    title: 'Defina sua Jornada de Trabalho',
    description: 'Estabeleça seus horários de atendimento para que o sistema saiba quando você está disponível.',
    link: '/dashboard/settings/availability',
    linkText: 'Definir Horários'
  },
  {
    key: 'hasServices',
    title: 'Cadastre seu Primeiro Serviço',
    description: 'Adicione os serviços que você oferece para começar a agendar seus clientes.',
    link: '/dashboard/services',
    linkText: 'Adicionar Serviço'
  },
  {
    key: 'hasClients',
    title: 'Adicione seu Primeiro Cliente',
    description: 'Importe ou cadastre um cliente para realizar o primeiro agendamento.',
    link: '/dashboard/clients',
    linkText: 'Adicionar Cliente'
  }
];

// CORREÇÃO: Adicionado "default" na exportação
export default function OnboardingGuide({ completedSteps }: OnboardingGuideProps) {
  const totalSteps = steps.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercentage = (completedCount / totalSteps) * 100;

  if (completedCount === totalSteps) {
    return null;
  }

  return (
    <div className="mb-8 bg-white rounded-lg shadow-md border border-brand-accent-light overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-brand-primary">Guia de Início Rápido</h2>
        <p className="mt-1 text-gray-600">Complete estes passos para configurar sua conta e começar a agendar.</p>
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-brand-accent">Progresso</span>
            <span className="text-sm font-medium text-brand-accent">{completedCount} de {totalSteps} completos</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-brand-accent h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="bg-brand-background p-6">
        <ul className="space-y-4">
          {steps.map((step) => {
            const isCompleted = completedSteps[step.key];
            return (
              <li key={step.key} className="flex items-start">
                <div className="flex-shrink-0 mr-4 mt-1">
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <CircleDashed className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className={`font-semibold ${isCompleted ? 'text-gray-500 line-through' : 'text-brand-primary'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                </div>
                {!isCompleted && (
                  <div className="ml-4 flex-shrink-0">
                    <Link href={step.link} className="px-3 py-1 text-sm font-semibold text-white bg-brand-accent rounded-md hover:bg-opacity-90">
                      {step.linkText}
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
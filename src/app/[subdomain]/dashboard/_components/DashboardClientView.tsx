// Caminho: src/app/[subdomain]/dashboard/_components/DashboardClientView.tsx
"use client";

import { useState, useEffect } from 'react';
import { BarChart, CheckCircle, XCircle, CalendarCheck, TrendingUp } from 'lucide-react';

// 1. Tipos atualizados para receber os novos dados
interface PopularService {
  serviceName: string;
  count: number;
}

interface DashboardStats {
  totalAppointments: number;
  completedAppointments: number;
  canceledAppointments: number;
  confirmedAppointments: number;
  popularServices: PopularService[];
}

type Period = 'day' | 'week' | 'month';

export default function DashboardClientView() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/dashboard/stats?period=${selectedPeriod}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar as estatísticas.');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, [selectedPeriod]);

  const statCards = [
    { title: 'Agendamentos', value: stats?.totalAppointments, icon: BarChart, color: 'blue' },
    { title: 'Confirmados', value: stats?.confirmedAppointments, icon: CalendarCheck, color: 'yellow' },
    { title: 'Finalizados', value: stats?.completedAppointments, icon: CheckCircle, color: 'green' },
    { title: 'Cancelados', value: stats?.canceledAppointments, icon: XCircle, color: 'red' },
  ];

  return (
    <div>
      {/* Botões de Filtro */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
          {(['day', 'week', 'month'] as Period[]).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors duration-200 ${
                selectedPeriod === period 
                  ? 'bg-white text-brand-primary shadow' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period === 'day' ? 'Hoje' : period === 'week' ? 'Esta Semana' : 'Este Mês'}
            </button>
          ))}
        </div>
      </div>

      {/* Cartões de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(card => (
          <div key={card.title} className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-full bg-${card.color}-100 text-${card.color}-600`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : card.value ?? 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. NOVA SEÇÃO: Serviços Mais Populares */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-brand-accent"/>
            <h2 className="text-2xl font-bold text-brand-primary">Serviços Populares</h2>
        </div>
        <div className="px-6 pb-6">
          {isLoading ? (
            <p className="text-gray-500">A carregar...</p>
          ) : stats && stats.popularServices.length > 0 ? (
            <ul className="space-y-4">
              {stats.popularServices.map((service, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-md font-medium text-gray-700">{service.serviceName}</span>
                  <span className="text-lg font-bold text-brand-primary">{service.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Não há dados de serviços para este período.</p>
          )}
        </div>
      </div>
    </div>
  );
}
// Caminho: src/app/[subdomain]/dashboard/_components/DashboardClientView.tsx
"use client";

import { useState, useEffect } from 'react';
import { BarChart, CheckCircle, XCircle } from 'lucide-react';

// Tipo para os dados de estatísticas que vêm da API
interface DashboardStats {
  totalAppointments: number;
  completedAppointments: number;
  canceledAppointments: number;
}

// Tipo para os períodos de filtro
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
        // No futuro, podemos adicionar um toast de erro aqui
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, [selectedPeriod]); // Roda o useEffect sempre que o período selecionado mudar

  const statCards = [
    {
      title: 'Agendamentos',
      value: stats?.totalAppointments,
      icon: BarChart,
      color: 'blue'
    },
    {
      title: 'Finalizados',
      value: stats?.completedAppointments,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Cancelados',
      value: stats?.canceledAppointments,
      icon: XCircle,
      color: 'red'
    },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map(card => (
          <div key={card.title} className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-full bg-${card.color}-100 text-${card.color}-600`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
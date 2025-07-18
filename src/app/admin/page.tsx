// Caminho: src/app/admin/page.tsx

import prisma from '@/lib/prisma';
import { Users, Building, Calendar } from 'lucide-react';

// Função para buscar as estatísticas da plataforma no servidor
async function getPlatformStats() {
  const [totalBusinesses, totalUsers, totalAppointments] = await Promise.all([
    prisma.business.count(),
    prisma.user.count(),
    prisma.appointment.count(),
  ]);

  return { totalBusinesses, totalUsers, totalAppointments };
}

export default async function AdminDashboardPage() {
  const stats = await getPlatformStats();

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Visão Geral da Plataforma</h2>
        <p className="mt-1 text-gray-600">
          Acompanhe o crescimento e a atividade do Tracke.me.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card: Total de Negócios */}
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <Building className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Negócios Cadastrados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBusinesses}</p>
            </div>
          </div>
        </div>

        {/* Card: Total de Usuários */}
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              {/* CORREÇÃO: A tag </g> foi corrigida para </p> */}
              <p className="text-sm font-medium text-gray-500">Total de Usuários</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        {/* Card: Total de Agendamentos */}
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Agendamentos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8">
        {/* Placeholder para futura tabela */}
      </div>
    </div>
  );
}
// Caminho: src/app/admin/businesses/_components/BusinessesView.tsx
"use client";

// 1. NOVAS IMPORTAÇÕES
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Repeat } from 'lucide-react'; // Ícone para o botão
import Modal from '@/components/ui/Modal'; // Nosso componente de Modal
import ChangePlanForm from './ChangePlanForm'; // Nosso novo formulário

// 2. INTERFACES ATUALIZADAS
interface SerializableBusiness {
  id: string;
  name: string;
  phone: string | null;
  planId: string | null; // ID do plano atual
  plan: {
    id: string;
    name: string;
  } | null;
  status: string;
  subdomain: string;
  createdAt: string;
  _count: {
    users: number;
  };
}

interface PlanSummary {
  id: string;
  name: string;
}

interface BusinessesViewProps {
  businesses: SerializableBusiness[];
  allPlans: PlanSummary[]; // Agora recebemos a lista de todos os planos
}

export default function BusinessesView({ businesses, allPlans }: BusinessesViewProps) {
  const router = useRouter();

  // 3. NOVO ESTADO PARA CONTROLAR O MODAL
  const [businessToChangePlan, setBusinessToChangePlan] = useState<SerializableBusiness | null>(null);

  const handleSuccess = () => {
    setBusinessToChangePlan(null); // Fecha o modal
    router.refresh(); // Atualiza os dados da página
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">Gestão de Negócios</h1>
        <p className="text-brand-accent mt-1">Visualize e gerencie todos os negócios cadastrados na plataforma.</p>
      </header>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Negócio</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subdomínio</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Usuários</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Cadastro</th>
                {/* 4. NOVA COLUNA DE AÇÕES */}
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {businesses.length > 0 ? (
                businesses.map((business) => (
                  <tr key={business.id}>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{business.name}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={`http://${business.subdomain}.lvh.me:3000/dashboard`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {business.subdomain}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {business.plan?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${business.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {business.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{business._count.users}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(business.createdAt), "dd/MM/yyyy", { locale: ptBR })}</td>
                    {/* 5. CÉLULA COM O BOTÃO DE AÇÃO */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                      <button 
                        onClick={() => setBusinessToChangePlan(business)} 
                        className="text-brand-accent hover:text-brand-primary"
                        title="Alterar Plano"
                      >
                        <Repeat className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">Nenhum negócio cadastrado na plataforma ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. RENDERIZAÇÃO DO MODAL E DO FORMULÁRIO */}
      {businessToChangePlan && (
        <Modal 
          title={`Alterar Plano de "${businessToChangePlan.name}"`}
          isOpen={!!businessToChangePlan} 
          onClose={() => setBusinessToChangePlan(null)}
        >
          <ChangePlanForm
            businessId={businessToChangePlan.id}
            currentPlanId={businessToChangePlan.planId}
            allPlans={allPlans}
            onSuccess={handleSuccess}
          />
        </Modal>
      )}
    </div>
  );
}
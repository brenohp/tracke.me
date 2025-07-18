// Caminho: src/app/admin/plans/_components/PlansView.tsx
"use client";

// Tipo para um plano já serializado
interface SerializablePlan {
  id: string;
  name: string;
  description: string | null;
  price: string;
  features: string; // Vem como uma string JSON
  active: boolean;
  createdAt: string;
}

interface PlansViewProps {
  plans: SerializablePlan[];
}

export default function PlansView({ plans }: PlansViewProps) {
  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">
            Gestão de Planos
          </h1>
          <p className="text-brand-accent mt-1">
            Crie e gerencie os planos de assinatura do Tracke.me.
          </p>
        </div>
        <button className="px-4 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90">
            + Novo Plano
        </button>
      </header>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Plano</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Mensal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans.length > 0 ? (
                plans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">R$ {plan.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        plan.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {plan.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum plano cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
// Caminho: src/app/admin/coupons/_components/CouponsView.tsx
"use client";

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipo para um cupão já serializado
interface SerializableCoupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: string | null;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
}

interface CouponsViewProps {
  coupons: SerializableCoupon[];
}

export default function CouponsView({ coupons }: CouponsViewProps) {
  // Função para formatar o tipo de desconto para português
  const formatDiscountType = (type: string) => {
    switch (type) {
      case 'PERCENTAGE':
        return 'Porcentagem';
      case 'FIXED':
        return 'Valor Fixo';
      case 'FREE_TRIAL':
        return 'Teste Grátis';
      default:
        return 'Desconhecido';
    }
  };

  // Função para formatar o valor do desconto
  const formatDiscountValue = (type: string, value: string | null) => {
    if (!value) return '-';
    if (type === 'PERCENTAGE') return `${value}%`;
    if (type === 'FIXED') return `R$ ${value}`;
    return 'N/A';
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">
            Gestão de Cupões
          </h1>
          <p className="text-brand-accent mt-1">
            Crie e gerencie cupões de desconto e de teste grátis.
          </p>
        </div>
        <button className="px-4 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90">
            + Novo Cupão
        </button>
      </header>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDiscountType(coupon.discountType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDiscountValue(coupon.discountType, coupon.discountValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        coupon.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {coupon.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coupon.expiresAt ? format(new Date(coupon.expiresAt), "dd/MM/yyyy", { locale: ptBR }) : 'Sem validade'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum cupão cadastrado.
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
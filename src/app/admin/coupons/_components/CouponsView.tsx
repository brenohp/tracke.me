// Caminho: src/app/admin/coupons/_components/CouponsView.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FilePenLine, Trash2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import CouponForm from './CouponForm';

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
  const router = useRouter();

  // Estados para os modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState<SerializableCoupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<SerializableCoupon | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSuccess = () => {
    setIsCreateModalOpen(false);
    setCouponToEdit(null);
    // A atualização dos dados é feita pelo router.refresh() dentro do formulário
  };

  // Função para confirmar e executar a exclusão
  const handleConfirmDelete = async () => {
    if (!couponToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/coupons/${couponToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao excluir o cupão.');
      }
      toast.success('Cupão excluído com sucesso!');
      setCouponToDelete(null); // Fecha o modal
      router.refresh(); // Atualiza a lista
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error('Ocorreu um erro ao excluir.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Funções para formatar os dados na tabela
  const formatDiscountType = (type: string) => {
    switch (type) {
      case 'PERCENTAGE': return 'Porcentagem';
      case 'FIXED': return 'Valor Fixo';
      case 'FREE_TRIAL': return 'Teste Grátis';
      default: return type;
    }
  };

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
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90"
        >
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
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-center gap-4">
                        <button onClick={() => setCouponToEdit(coupon)} className="text-brand-accent hover:text-brand-accent-light">
                          <FilePenLine className="h-5 w-5" />
                        </button>
                        <button onClick={() => setCouponToDelete(coupon)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum cupão cadastrado. Crie o primeiro!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal para CRIAR um cupão */}
      <Modal title="Criar Novo Cupão" isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <CouponForm onSuccess={handleSuccess} />
      </Modal>
      
      {/* Modal para EDITAR um cupão */}
      <Modal title="Editar Cupão" isOpen={!!couponToEdit} onClose={() => setCouponToEdit(null)}>
        <CouponForm 
          initialData={couponToEdit}
          onSuccess={handleSuccess} 
        />
      </Modal>

      {/* Modal para CONFIRMAR a exclusão */}
      <Modal title="Confirmar Exclusão" isOpen={!!couponToDelete} onClose={() => setCouponToDelete(null)}>
        <div>
          <p className="text-gray-700">
            Tem a certeza que deseja excluir o cupão <strong className="font-semibold text-brand-primary">{couponToDelete?.code}</strong>? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="px-4 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              onClick={() => setCouponToDelete(null)}
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'A excluir...' : 'Sim, excluir'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
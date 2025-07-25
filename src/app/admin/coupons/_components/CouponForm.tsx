// Caminho: src/app/admin/coupons/_components/CouponForm.tsx
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Tipo para os dados que o formulário pode receber para edição
interface CouponData {
  id: string;
  code: string;
  discountType: string;
  discountValue: string | null;
  expiresAt: string | null;
  active: boolean;
}

interface CouponFormProps {
  onSuccess?: () => void;
  initialData?: CouponData | null;
}

export default function CouponForm({ onSuccess, initialData }: CouponFormProps) {
  const router = useRouter();
  
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('FREE_TRIAL');
  const [discountValue, setDiscountValue] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [active, setActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!initialData;

  // Preenche o formulário quando estiver no modo de edição
  useEffect(() => {
    if (initialData) {
      setCode(initialData.code);
      setDiscountType(initialData.discountType);
      setDiscountValue(initialData.discountValue || '');
      // Formata a data para o input 'date'
      setExpiresAt(initialData.expiresAt ? initialData.expiresAt.substring(0, 10) : '');
      setActive(initialData.active);
    }
  }, [initialData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const couponData = {
        code,
        discountType,
        discountValue: discountType !== 'FREE_TRIAL' ? Number(discountValue) : null,
        expiresAt: expiresAt || null,
        active,
      };

      const url = isEditing ? `/api/admin/coupons/${initialData?.id}` : '/api/admin/coupons';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao guardar o cupão.');
      }

      toast.success(isEditing ? 'Cupão atualizado com sucesso!' : 'Cupão criado com sucesso!');
      router.refresh();
      
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">Código do Cupão</label>
          <input type="text" id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required placeholder="EX: LANCAMENTO2025" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>

        <div>
          <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">Tipo de Desconto</label>
          <select id="discountType" value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option value="FREE_TRIAL">Teste Grátis</option>
            <option value="PERCENTAGE">Porcentagem (%)</option>
            <option value="FIXED">Valor Fixo (R$)</option>
          </select>
        </div>
        
        {discountType !== 'FREE_TRIAL' && (
          <div>
            <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">Valor do Desconto</label>
            <input type="number" step="0.01" id="discountValue" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} required={discountType !== 'FREE_TRIAL'} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
        )}

        <div>
          <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">Data de Validade (Opcional)</label>
          <input type="date" id="expiresAt" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>

        <div className="flex items-center">
            <input type="checkbox" id="active" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 text-brand-accent border-gray-300 rounded"/>
            <label htmlFor="active" className="ml-2 block text-sm text-gray-900">Cupão Ativo</label>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
            {isLoading ? 'A guardar...' : (isEditing ? 'Salvar Alterações' : 'Criar Cupão')}
          </button>
        </div>
      </form>
    </div>
  );
}
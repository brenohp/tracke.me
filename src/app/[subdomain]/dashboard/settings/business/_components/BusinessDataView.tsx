// Caminho: src/app/[subdomain]/dashboard/settings/business/_components/BusinessDataView.tsx
"use client";

import { useState, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// 1. Tipo para os dados iniciais ATUALIZADO com os campos de endereço
interface BusinessData {
  id: string;
  name: string;
  phone: string | null;
  addressStreet: string | null;
  addressNumber: string | null;
  addressComplement: string | null;
  addressNeighborhood: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressZipCode: string | null;
}

interface BusinessDataViewProps {
  initialData: BusinessData;
}

export function BusinessDataView({ initialData }: BusinessDataViewProps) {
  const router = useRouter();
  
  // Estados para os campos de contato
  const [name, setName] = useState(initialData.name);
  const [phone, setPhone] = useState(initialData.phone || '');
  
  // 2. Novos estados para os campos de endereço
  const [street, setStreet] = useState(initialData.addressStreet || '');
  const [number, setNumber] = useState(initialData.addressNumber || '');
  const [complement, setComplement] = useState(initialData.addressComplement || '');
  const [neighborhood, setNeighborhood] = useState(initialData.addressNeighborhood || '');
  const [city, setCity] = useState(initialData.addressCity || '');
  const [state, setState] = useState(initialData.addressState || '');
  const [zipCode, setZipCode] = useState(initialData.addressZipCode || '');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // 3. Payload ATUALIZADO para enviar todos os dados
      const response = await fetch(`/api/business`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          phone,
          addressStreet: street,
          addressNumber: number,
          addressComplement: complement,
          addressNeighborhood: neighborhood,
          addressCity: city,
          addressState: state,
          addressZipCode: zipCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar os dados.');
      }

      toast.success('Dados do negócio atualizados com sucesso!');
      router.refresh();
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
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção de Dados de Contato */}
        <section>
          <h3 className="text-lg font-semibold text-brand-primary border-b pb-2 mb-6">Contato e Identificação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Nome do Negócio</label>
              <input type="text" id="businessName" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700">Telefone de Contato (WhatsApp)</label>
              <input type="text" id="businessPhone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 4. NOVA SEÇÃO DE ENDEREÇO NO FORMULÁRIO                           */}
        {/* =================================================================== */}
        <section>
          <h3 className="text-lg font-semibold text-brand-primary border-b pb-2 mb-6">Localização</h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="md:col-span-4">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">Endereço (Rua, Av.)</label>
              <input type="text" id="street" value={street} onChange={(e) => setStreet(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="number" className="block text-sm font-medium text-gray-700">Número</label>
              <input type="text" id="number" value={number} onChange={(e) => setNumber(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="complement" className="block text-sm font-medium text-gray-700">Complemento (Opcional)</label>
              <input type="text" id="complement" value={complement} onChange={(e) => setComplement(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">Bairro</label>
              <input type="text" id="neighborhood" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
              <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
              <input type="text" id="state" value={state} onChange={(e) => setState(e.target.value)} maxLength={2} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">CEP</label>
              <input type="text" id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
            {isLoading ? 'A guardar...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
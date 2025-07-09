// Caminho: src/app/[subdomain]/dashboard/servicos/_components/ServicesClientView.tsx
"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FilePenLine, Trash2 } from 'lucide-react';
import ServiceForm from '../ServiceForm'; 
import ServiceModal from './ServiceModal'; 

// Tipos
interface Professional {
  id: string;
  name: string;
}

interface SerializableService {
  id: string;
  name: string;
  description: string | null;
  durationInMinutes: number;
  price: string;
  status: string;
  professionals: Professional[];
}

interface ServicesClientViewProps {
  services: SerializableService[];
  professionals: Professional[];
}

export default function ServicesClientView({ services, professionals }: ServicesClientViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<SerializableService | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<SerializableService | null>(null);

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/services/${serviceToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao excluir o serviço.');
      }

      toast.success('Serviço excluído com sucesso!');
      setServiceToDelete(null); 
      router.push(pathname);

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">
          Gestão de Serviços
        </h1>
        <button 
          className="px-4 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Adicionar Serviço
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-2xl font-bold text-brand-primary p-6">Serviços Cadastrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Serviço</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duração</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                {/* 1. NOVA COLUNA NO CABEÇALHO */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.length > 0 ? (
                services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-500">{service.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.durationInMinutes} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {service.price}
                    </td>
                    {/* 2. NOVA CÉLULA COM A ETIQUETA DE STATUS */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        service.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {service.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-center gap-4">
                        <button aria-label="Editar serviço" title="Editar serviço" className="text-brand-accent hover:text-brand-accent-light" onClick={() => setServiceToEdit(service)}>
                          <FilePenLine className="h-5 w-5" />
                        </button>
                        <button aria-label="Excluir serviço" title="Excluir serviço" className="text-red-500 hover:text-red-700" onClick={() => setServiceToDelete(service)}>
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum serviço cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ServiceModal title="Adicionar Novo Serviço" isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <ServiceForm professionals={professionals} onSuccess={() => setIsCreateModalOpen(false)} />
      </ServiceModal>

      <ServiceModal title="Editar Serviço" isOpen={!!serviceToEdit} onClose={() => setServiceToEdit(null)}>
        <ServiceForm professionals={professionals} initialData={serviceToEdit} onSuccess={() => setServiceToEdit(null)} />
      </ServiceModal>

      <ServiceModal title="Confirmar Exclusão" isOpen={!!serviceToDelete} onClose={() => setServiceToDelete(null)}>
        <div>
          <p className="text-gray-700">
            Tem a certeza que deseja excluir o serviço permanentemente? Esta ação não pode ser desfeita.
            <br />
            <strong className="font-semibold text-brand-primary">{serviceToDelete?.name}</strong>
          </p>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" className="px-4 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" onClick={() => setServiceToDelete(null)} disabled={isDeleting}>
              Cancelar
            </button>
            <button type="button" className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400" onClick={handleDeleteService} disabled={isDeleting}>
              {isDeleting ? 'A excluir...' : 'Sim, excluir'}
            </button>
          </div>
        </div>
      </ServiceModal>
    </div>
  );
}
// Caminho: src/app/[subdomain]/dashboard/clientes/_components/ClientsClientView.tsx
"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FilePenLine, Trash2 } from 'lucide-react';
import ClientForm from './ClientForm'; 
import ServiceModal from '../../services/_components/ServiceModal'; 

// Tipos
interface SerializableClient {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  observations: string | null;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientsClientViewProps {
  clients: SerializableClient[];
}

export default function ClientsClientView({ clients }: ClientsClientViewProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Estados para os modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<SerializableClient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // 1. Novo estado para controlar o modal de edição
  const [clientToEdit, setClientToEdit] = useState<SerializableClient | null>(null);

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/clients/${clientToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao excluir o cliente.');
      }

      toast.success('Cliente excluído com sucesso!');
      setClientToDelete(null);
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
          Gestão de Clientes
        </h1>
        <button 
          className="px-4 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Adicionar Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-2xl font-bold text-brand-primary p-6">Clientes Cadastrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.phone && <div className="text-sm text-gray-900">{client.phone}</div>}
                      {client.email && <div className="text-sm text-gray-500">{client.email}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-center gap-4">
                        {/* 2. Botão de editar agora é funcional */}
                        <button 
                          aria-label="Editar cliente" 
                          title="Editar cliente" 
                          className="text-brand-accent hover:text-brand-accent-light"
                          onClick={() => setClientToEdit(client)}
                        >
                          <FilePenLine className="h-5 w-5" />
                        </button>
                        <button 
                          aria-label="Excluir cliente" 
                          title="Excluir cliente" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setClientToDelete(client)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum cliente cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para CRIAR cliente */}
      <ServiceModal title="Adicionar Novo Cliente" isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <ClientForm onSuccess={() => setIsCreateModalOpen(false)} />
      </ServiceModal>
      
      {/* 3. Novo Modal para EDITAR cliente */}
      <ServiceModal title="Editar Cliente" isOpen={!!clientToEdit} onClose={() => setClientToEdit(null)}>
        <ClientForm 
          initialData={clientToEdit} // Passa os dados para o formulário
          onSuccess={() => setClientToEdit(null)} // Fecha o modal no sucesso
        />
      </ServiceModal>

      {/* Modal para CONFIRMAR a exclusão */}
      <ServiceModal title="Confirmar Exclusão" isOpen={!!clientToDelete} onClose={() => setClientToDelete(null)}>
        <div>
          <p className="text-gray-700">
            Tem a certeza que deseja excluir o cliente permanentemente?
            <br />
            <strong className="font-semibold text-brand-primary">{clientToDelete?.name}</strong>
          </p>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" className="px-4 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" onClick={() => setClientToDelete(null)} disabled={isDeleting}>
              Cancelar
            </button>
            <button type="button" className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400" onClick={handleDeleteClient} disabled={isDeleting}>
              {isDeleting ? 'A excluir...' : 'Sim, excluir'}
            </button>
          </div>
        </div>
      </ServiceModal>
    </div>
  );
}
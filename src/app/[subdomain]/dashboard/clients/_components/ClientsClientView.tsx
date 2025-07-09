// Caminho: src/app/[subdomain]/dashboard/clientes/_components/ClientsClientView.tsx
"use client";

// No futuro, importaremos o useState e outros hooks aqui
import { FilePenLine, Trash2 } from 'lucide-react';

// Tipo para um cliente já serializado (com datas convertidas para string)
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
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">
          Gestão de Clientes
        </h1>
        <button 
          className="px-4 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90"
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
                        <button aria-label="Editar cliente" title="Editar cliente" className="text-brand-accent hover:text-brand-accent-light">
                          <FilePenLine className="h-5 w-5" />
                        </button>
                        <button aria-label="Excluir cliente" title="Excluir cliente" className="text-red-500 hover:text-red-700">
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
    </div>
  );
}
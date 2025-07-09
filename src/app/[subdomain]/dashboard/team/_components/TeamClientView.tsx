// Caminho: src/app/[subdomain]/dashboard/team/_components/TeamClientView.tsx
"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FilePenLine, Trash2 } from 'lucide-react';
import TeamMemberForm from './TeamMemberForm';
import ServiceModal from '../../services/_components/ServiceModal';

// Tipo para um membro da equipe já serializado
interface SerializableTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface TeamClientViewProps {
  teamMembers: SerializableTeamMember[];
}

export default function TeamClientView({ teamMembers }: TeamClientViewProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Estados para os modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<SerializableTeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // 1. Novo estado para controlar o modal de edição
  const [memberToEdit, setMemberToEdit] = useState<SerializableTeamMember | null>(null);

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/team/${memberToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao remover o membro.');
      }

      toast.success('Membro removido com sucesso!');
      setMemberToDelete(null);
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
          Gestão de Equipe
        </h1>
        <button 
          className="px-4 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Adicionar Membro
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-2xl font-bold text-brand-primary p-6">Membros Cadastrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.role === 'OWNER' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.role === 'OWNER' ? 'Proprietário' : 'Funcionário'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-center gap-4">
                        {/* 2. Botão de editar agora é funcional */}
                        <button 
                          aria-label="Editar membro" 
                          title="Editar membro" 
                          className="text-brand-accent hover:text-brand-accent-light"
                          onClick={() => setMemberToEdit(member)}
                          disabled={member.role === 'OWNER'} // Desativa o botão para o proprietário
                        >
                          <FilePenLine className="h-5 w-5" />
                        </button>
                        <button 
                          aria-label="Excluir membro" 
                          title="Excluir membro" 
                          className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                          onClick={() => setMemberToDelete(member)}
                          disabled={member.role === 'OWNER'} // Desativa o botão para o proprietário
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum membro na equipe ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para CRIAR membro */}
      <ServiceModal title="Adicionar Novo Membro" isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <TeamMemberForm onSuccess={() => setIsCreateModalOpen(false)} />
      </ServiceModal>
      
      {/* 3. Novo Modal para EDITAR membro */}
      <ServiceModal title="Editar Membro" isOpen={!!memberToEdit} onClose={() => setMemberToEdit(null)}>
        <TeamMemberForm 
          initialData={memberToEdit} 
          onSuccess={() => setMemberToEdit(null)}
        />
      </ServiceModal>

      {/* Modal para CONFIRMAR a exclusão */}
      <ServiceModal title="Confirmar Remoção" isOpen={!!memberToDelete} onClose={() => setMemberToDelete(null)}>
        <div>
          <p className="text-gray-700">
            Tem a certeza que deseja remover este membro da equipe?
            <br />
            <strong className="font-semibold text-brand-primary">{memberToDelete?.name}</strong>
          </p>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" className="px-4 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" onClick={() => setMemberToDelete(null)} disabled={isDeleting}>
              Cancelar
            </button>
            <button type="button" className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400" onClick={handleDeleteMember} disabled={isDeleting}>
              {isDeleting ? 'A remover...' : 'Sim, remover'}
            </button>
          </div>
        </div>
      </ServiceModal>
    </div>
  );
}
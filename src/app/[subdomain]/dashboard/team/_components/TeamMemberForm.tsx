// Caminho: src/app/[subdomain]/dashboard/team/_components/TeamMemberForm.tsx
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';

// Tipo para os dados que o formulário pode receber para edição
interface SerializableTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TeamMemberFormProps {
  initialData?: SerializableTeamMember | null;
  onSuccess?: () => void;
}

export default function TeamMemberForm({ initialData, onSuccess }: TeamMemberFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Estados para controlar os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE'); // Novo estado para o cargo
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!initialData; // Flag para saber se estamos a editar ou a criar

  // Preenche o formulário quando estiver no modo de edição
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setRole(initialData.role);
    }
  }, [initialData]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('EMPLOYEE');
  }

  // handleSubmit agora lida com criar (POST) e editar (PUT)
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Prepara os dados e a URL com base no modo (criação ou edição)
    const url = isEditing ? `/api/team/${initialData.id}` : '/api/team';
    const method = isEditing ? 'PUT' : 'POST';
    const body = isEditing 
      ? JSON.stringify({ name, role })
      : JSON.stringify({ name, email, password });

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao guardar o membro.');
      }

      toast.success(isEditing ? 'Membro atualizado com sucesso!' : 'Membro adicionado com sucesso!');
      
      if (!isEditing) {
        resetForm();
      }
      
      router.push(pathname);
      
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" />
        </div>

        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={isEditing} // Desativa o campo de email na edição
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent disabled:bg-gray-100" 
            />
        </div>

        {/* Mostra o campo de senha apenas no modo de criação */}
        {!isEditing && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha Provisória</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" />
          </div>
        )}

        {/* Mostra o campo de cargo apenas no modo de edição */}
        {isEditing && (
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Cargo</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent">
                    <option value="OWNER">Proprietário</option>
                    <option value="EMPLOYEE">Funcionário</option>
                </select>
            </div>
        )}

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
            {isLoading ? 'A guardar...' : (isEditing ? 'Salvar Alterações' : 'Adicionar Membro')}
          </button>
        </div>
      </form>
    </div>
  );
}
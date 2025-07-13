// Caminho: src/app/[subdomain]/dashboard/settings/profile/page.tsx
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProfileSettingsPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setEmail(data.email);
        } else {
          toast.error('Não foi possível carregar os dados do seu perfil.');
        }
      } catch (error) {
        console.error('Erro de conexão ao buscar o perfil:', error);
        toast.error('Erro de conexão ao buscar o perfil.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('As novas senhas não coincidem.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao atualizar o perfil.');
      }
      
      toast.success('Perfil atualizado com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
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
    <div className="p-4 md:p-8">
      {/* ====================================================== */}
      {/* ESTE É O BLOCO DO CABEÇALHO COM O BOTÃO DE VOLTAR      */}
      {/* ====================================================== */}
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings" className="p-2 rounded-full text-brand-accent hover:bg-gray-100 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-brand-primary">
            Editar Perfil
          </h1>
        </div>
        <p className="text-brand-accent mt-1 pl-14">
          Atualize seu nome e senha.
        </p>
      </header>
      
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
          {/* Seção de Informações Pessoais */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" value={email} disabled className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" />
            </div>
          </div>
          
          {/* Seção de Alteração de Senha */}
          <div className="space-y-4 border-t pt-8">
             <h2 className="text-lg font-medium text-brand-primary">Alterar Senha</h2>
             <p className="text-sm text-gray-500">Deixe os campos em branco se não desejar alterar a senha.</p>
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Senha Atual</label>
              <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nova Senha</label>
              <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
              {isLoading ? 'A guardar...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
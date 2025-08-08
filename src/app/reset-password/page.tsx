// src/app/reset-password/page.tsx
"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Check, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type PasswordCriterion = {
  text: string;
  isValid: boolean;
  regex: RegExp;
};

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriterion[]>([
    { text: 'Pelo menos 8 caracteres', isValid: false, regex: /.{8,}/ },
    { text: 'Pelo menos uma letra', isValid: false, regex: /[a-zA-Z]/ },
    { text: 'Pelo menos um número', isValid: false, regex: /\d/ },
  ]);

  // Valida a senha em tempo real
  useEffect(() => {
    setPasswordCriteria(prevCriteria =>
      prevCriteria.map(criterion => ({
        ...criterion,
        isValid: criterion.regex.test(newPassword),
      }))
    );
  }, [newPassword]);

  // Se não houver token na URL, redireciona
  useEffect(() => {
    if (!token) {
      toast.error('Link de redefinição inválido ou ausente.');
      router.push('/login');
    }
  }, [token, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isPasswordValid = passwordCriteria.every(c => c.isValid);
    if (!isPasswordValid) {
      toast.error('Sua nova senha não atende a todos os critérios de segurança.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao redefinir a senha.');
      }

      toast.success('Senha redefinida com sucesso!');
      setIsSuccess(true);

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
    <div className="flex items-center justify-center min-h-screen py-12 bg-brand-background">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-brand-primary">
          Crie uma Nova Senha
        </h1>
        
        {isSuccess ? (
          <div className="text-center">
            <p className="text-gray-600 mt-4">
              Sua senha foi alterada com sucesso. Você já pode fazer o login com suas novas credenciais.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/login">Ir para o Login</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-lg text-center text-brand-accent">
              Digite sua nova senha abaixo.
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input id="newPassword" type={showPassword ? 'text' : 'password'} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nova senha" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-brand-accent">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <ul className="space-y-1 text-sm">
                {passwordCriteria.map((criterion, index) => (
                  <li key={index} className={`flex items-center gap-2 transition-colors ${criterion.isValid ? 'text-green-600' : 'text-gray-500'}`}>
                    {criterion.isValid ? <Check size={16} /> : <X size={16} />}
                    <span>{criterion.text}</span>
                  </li>
                ))}
              </ul>

              <div className="relative">
                <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirme a nova senha" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-brand-accent">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Salvando...' : 'Redefinir Senha'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// Componente de Página que usa Suspense para ler os parâmetros da URL
export default function ResetPasswordPage() {
    return (
      <Suspense fallback={<div>Carregando...</div>}>
        <ResetPasswordForm />
      </Suspense>
    );
}

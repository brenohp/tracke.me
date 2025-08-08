// src/app/forgot-password/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Chama a API que criamos no passo anterior
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // Por segurança, sempre mostramos uma mensagem de sucesso,
      // mesmo que o email não exista, para não revelar informações.
      setIsSubmitted(true);

    } catch {
      toast.error('Ocorreu um erro ao conectar ao servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 bg-brand-background">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-brand-primary">
          Recuperar Senha
        </h1>
        
        {isSubmitted ? (
          // Tela de sucesso após o envio
          <div className="text-center">
            <p className="text-gray-600 mt-4">
              Se um usuário com este e-mail estiver cadastrado, um link para redefinição de senha foi enviado para sua caixa de entrada.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/login">Voltar para o Login</Link>
              </Button>
            </div>
          </div>
        ) : (
          // Formulário inicial
          <>
            <h2 className="text-lg text-center text-brand-accent">
              Digite seu e-mail para continuar
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                id="email" 
                type="email" 
                autoComplete="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Seu email de cadastro" 
              />
              <div className="pt-2">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </Button>
              </div>
              <div className="text-sm text-center">
                <Link href="/login" className="font-medium text-brand-accent hover:underline">
                  Lembrou a senha? Faça login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
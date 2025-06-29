// src/app/login/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Login bem-sucedido! Redirecionando...');
        router.push('/dashboard'); 
      } else {
        toast.error(data.message || 'Falha no login.');
      }
    } catch {
      toast.error('Ocorreu um erro ao conectar ao servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Espaçamento vertical adicionado para consistência
    <div className="flex items-center justify-center min-h-screen py-12 bg-brand-background">
      {/* Espaçamento interno e entre elementos ajustado */}
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-brand-primary">
          Tracke.me
        </h1>
        {/* Tamanho da fonte do subtítulo ajustado */}
        <h2 className="text-lg text-center text-brand-accent">
          Acesse sua conta
        </h2>
        {/* Espaçamento do formulário ajustado */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Inputs agora usam placeholder, sem labels externas */}
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
          />
          
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-brand-accent"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <div className="flex items-center justify-end">
            <Link 
              href="/forgot-password" 
              className="text-sm font-medium text-brand-accent hover:underline"
            >
              Esqueci a senha
            </Link>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
          
          {/* Link para a página de cadastro, para consistência */}
          <div className="text-sm text-center">
            <span className="text-gray-600">Não tem uma conta? </span>
            <Link href="/register" className="font-medium text-brand-accent hover:underline">
              Cadastre-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
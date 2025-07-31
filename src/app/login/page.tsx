// Caminho do arquivo: src/app/login/page.tsx
"use client";

import { useState } from 'react';
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

      if (response.ok && data.subdomain) {
        toast.success('Login bem-sucedido! Redirecionando...');
        
        // --- CORREÇÃO PARA lvh.me ---
        const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'lvh.me:3000';
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const redirectUrl = `${protocol}://${data.subdomain}.${appDomain}/dashboard`;
        
        window.location.href = redirectUrl;
        
      } else {
        toast.error(data.message || 'Falha no login.');
        setIsLoading(false);
      }
    } catch {
      toast.error('Ocorreu um erro ao conectar ao servidor.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 bg-brand-background">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-brand-primary">
          CliendaApp
        </h1>
        <h2 className="text-lg text-center text-brand-accent">
          Acesse sua conta
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu email" />
          <div className="relative">
            <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-brand-accent">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="flex items-center justify-end">
            <Link href="/forgot-password"  className="text-sm font-medium text-brand-accent hover:underline">
              Esqueci a senha
            </Link>
          </div>
          <div className="pt-2">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
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
// src/app/register/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subdomain, setSubdomain] = useState(''); // <-- 1. Novo estado para o subdomínio
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      // 2. Adiciona 'subdomain' ao corpo da requisição
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, ownerName, email, password, phone, subdomain }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Negócio cadastrado com sucesso! Faça o login para começar.');
        router.push('/login'); 
      } else {
        toast.error(data.message || 'Falha no cadastro.');
      }
    } catch {
      toast.error('Ocorreu um erro ao conectar ao servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 bg-brand-background">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-brand-primary">Crie sua Conta</h1>
        <h2 className="text-lg text-center text-brand-accent">
          Comece a gerenciar seu negócio com o Tracke.me
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <Input id="businessName" type="text" required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Nome do seu Negócio" />
          
          {/* 3. Novo campo para o Subdomínio com dica de URL */}
          <div>
            <label htmlFor="subdomain" className="text-sm font-medium text-brand-primary">Endereço no Tracke.me</label>
            <div className="flex items-center mt-1">
              <Input
                id="subdomain"
                type="text"
                required
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="ex: barbearia-classica"
                className="rounded-r-none"
              />
              <span className="inline-flex items-center px-3 text-sm text-gray-500 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 h-10">
                .tracke.me
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Use apenas letras, números e hífens.</p>
          </div>

          <Input id="ownerName" type="text" required value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Seu nome completo" />
          <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefone / WhatsApp (Opcional)" />
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu melhor email" />
          
          <div className="relative">
            <Input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Crie uma senha" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-brand-accent">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirme sua senha" />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-brand-accent">
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent-light border-gray-300"/>
            <label htmlFor="terms" className="text-sm text-gray-600 select-none">
              Eu li e concordo com os <a href="/terms" target="_blank" className="font-medium text-brand-accent hover:underline">Termos de Uso</a>.
            </label>
          </div>
          
          <div className="pt-2">
            <Button type="submit" disabled={isLoading || !termsAccepted} className="w-full">
              {isLoading ? 'Cadastrando...' : 'Criar minha conta'}
            </Button>
          </div>

          <div className="text-sm text-center">
            <span className="text-gray-600">Já tem uma conta? </span>
            <Link href="/login" className="font-medium text-brand-accent hover:underline">
              Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
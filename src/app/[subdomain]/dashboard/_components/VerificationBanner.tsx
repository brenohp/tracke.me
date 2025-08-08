// src/app/[subdomain]/dashboard/_components/VerificationBanner.tsx

"use client";

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface VerificationBannerProps {
  userEmail: string;
}

export function VerificationBanner({ userEmail }: VerificationBannerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      // No próximo passo, criaremos esta API
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Falha ao reenviar o e-mail.');
      }
      
      toast.success('Um novo e-mail de confirmação foi enviado para sua caixa de entrada!');

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
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4" role="alert">
      <div className="flex items-center">
        <div className="py-1">
          <AlertTriangle className="h-6 w-6 mr-4" />
        </div>
        <div>
          <p className="font-bold">Confirme seu endereço de e-mail</p>
          <p className="text-sm">
            Para garantir a segurança da sua conta, por favor, verifique seu e-mail.
          </p>
        </div>
        <div className="ml-auto">
          <button
            onClick={handleResendEmail}
            disabled={isLoading}
            className="px-4 py-2 font-semibold text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-yellow-300 flex items-center"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isLoading ? 'Enviando...' : 'Reenviar E-mail'}
          </button>
        </div>
      </div>
    </div>
  );
}
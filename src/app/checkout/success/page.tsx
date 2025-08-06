// src/app/checkout/success/page.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShieldCheck } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-brand-background p-4">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-md w-full">
        <ShieldCheck className="h-16 w-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-brand-primary mb-2">Conta Criada com Sucesso!</h1>
        <p className="text-gray-600 mb-8">
          Seu pagamento foi processado e sua conta está pronta. Por favor, faça o login para acessar seu dashboard e começar a gerenciar seu negócio.
        </p>
        <Button asChild className="w-full text-lg py-3">
          <Link href="/login">
            Ir para o Login
          </Link>
        </Button>
      </div>
    </div>
  );
}
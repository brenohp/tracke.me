// src/app/[subdomain]/dashboard/settings/billing/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Função para buscar os dados do plano do negócio logado
async function getBillingData(businessId: string) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      plan: {
        select: {
          name: true,
          price: true,
          features: true,
        }
      }
    }
  });
  return business;
}

export default async function BillingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session) {
    redirect('/login');
  }

  const businessData = await getBillingData(session.businessId);

  if (!businessData || !businessData.plan) {
    // Redireciona para a página de planos se não tiver uma assinatura ativa
    return (
      <div>
        <h1 className="text-xl font-bold">Você ainda não tem um plano ativo.</h1>
        <Link href="/#pricing" className="text-brand-accent hover:underline mt-2">
          Escolha um plano para começar
        </Link>
      </div>
    );
  }

  // Serializa os dados para passar para o componente de cliente (que criaremos depois)
  const planData = {
    name: businessData.plan.name,
    price: businessData.plan.price.toString(),
    features: JSON.stringify(businessData.plan.features),
  };

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings" className="p-2 rounded-full text-brand-accent hover:bg-gray-100 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-brand-primary">
            Assinatura e Faturamento
          </h1>
        </div>
        <p className="text-brand-accent mt-1 pl-14">
          Gerencie seu plano e informações de pagamento.
        </p>
      </header>

      {/* No próximo passo, vamos criar este componente de cliente */}
      {/* <BillingClientView plan={planData} /> */}

      {/* Por enquanto, exibimos as informações diretamente */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
        <h2 className="text-xl font-bold text-brand-primary mb-4">Seu Plano Atual</h2>
        <div className="space-y-2">
          <p><strong>Plano:</strong> {planData.name}</p>
          <p><strong>Preço:</strong> R$ {planData.price} / mês</p>
        </div>
      </div>
    </div>
  );
}
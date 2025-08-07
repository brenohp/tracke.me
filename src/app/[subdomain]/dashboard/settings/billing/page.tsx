// src/app/[subdomain]/dashboard/settings/billing/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BillingClientView from './_components/BillingclientView';

// A função para buscar os dados continua a mesma
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
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-xl font-bold">Você ainda não tem um plano ativo.</h1>
        <Link href="/#pricing" className="text-brand-accent hover:underline mt-2 inline-block">
          Escolha um plano para começar
        </Link>
      </div>
    );
  }

  // Serializa os dados para passar para o componente de cliente
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

      {/* 2. Renderizamos o componente de cliente, passando os dados do plano */}
      <BillingClientView plan={planData} />

    </div>
  );
}
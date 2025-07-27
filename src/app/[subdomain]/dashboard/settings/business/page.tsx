// Caminho: src/app/[subdomain]/dashboard/settings/business/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import { BusinessDataView } from './_components/BusinessDataView';

// Função para buscar os dados do negócio do usuário logado
async function getBusinessData(businessId: string) {
  try {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      // ===================================================================
      // ATUALIZAÇÃO: Incluindo os novos campos de endereço na busca
      // ===================================================================
      select: {
        id: true,
        name: true,
        phone: true,
        addressStreet: true,
        addressNumber: true,
        addressComplement: true,
        addressNeighborhood: true,
        addressCity: true,
        addressState: true,
        addressZipCode: true,
      },
    });
    return business;
  } catch (error) {
    console.error("Falha ao buscar dados do negócio:", error);
    return null;
  }
}

export default async function BusinessSettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session) {
    redirect('/login');
  }

  const businessData = await getBusinessData(session.businessId);

  if (!businessData) {
    return <div>Não foi possível carregar os dados do seu negócio.</div>;
  }
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">
          Dados do Negócio
        </h1>
        <p className="text-brand-accent mt-1">
          Gerencie as informações públicas e de contato do seu estabelecimento.
        </p>
      </header>
      
      <BusinessDataView initialData={businessData} />
    </div>
  );
}
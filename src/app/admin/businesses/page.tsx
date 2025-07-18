// Caminho: src/app/admin/businesses/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import BusinessesView from './_components/BusinessesView'; // Vamos criar este ficheiro a seguir

// Função para buscar os dados de todos os negócios no servidor
async function getBusinessesData() {
  const businesses = await prisma.business.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    // Inclui a contagem de usuários para sabermos o tamanho da equipe
    include: {
      _count: {
        select: { users: true },
      },
    },
  });
  
  return businesses;
}

export default async function AdminBusinessesPage() {
  // Segurança em camadas: verificamos a sessão novamente aqui
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  const businesses = await getBusinessesData();

  // Converte os dados para um formato simples (serializável)
  const serializableBusinesses = businesses.map(business => ({
    ...business,
    createdAt: business.createdAt.toISOString(),
    updatedAt: business.updatedAt.toISOString(),
  }));

  // A página renderiza o componente de cliente, passando os dados
  return <BusinessesView businesses={serializableBusinesses} />;
}
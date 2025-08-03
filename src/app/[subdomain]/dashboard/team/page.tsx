// Caminho: src/app/[subdomain]/dashboard/team/page.tsx

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import TeamClientView from './_components/TeamClientView'; // Vamos criar este ficheiro a seguir

// Função para buscar os dados da equipe no servidor
async function getTeamData(businessId: string) {
  const teamMembers = await prisma.user.findMany({
    where: { businessId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });
  
  return teamMembers;
}

export default async function TeamPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session) {
    redirect('/login');
  }

  const teamMembers = await getTeamData(session.businessId);

  // Converte os dados para um formato simples (serializável)
  const serializableTeamMembers = teamMembers.map(member => ({
    ...member,
    createdAt: member.createdAt.toISOString(),
  }));

  // A página apenas renderiza o componente de cliente, passando os dados
  return <TeamClientView teamMembers={serializableTeamMembers} />;
}
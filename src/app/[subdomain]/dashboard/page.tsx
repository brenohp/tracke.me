// Caminho: src/app/[subdomain]/dashboard/page.tsx
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return <h1 className="text-xl text-red-500">Erro: Token não encontrado.</h1>;
  }

  const session = verifyToken(token);
  if (!session) {
    return <h1 className="text-xl text-red-500">Sessão inválida.</h1>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { business: true },
  });

  if (!user || !user.business) {
    return <h1 className="text-xl text-red-500">Usuário ou negócio não encontrado.</h1>;
  }

  // O layout.tsx vai renderizar o Header e o UserProfile.
  // Esta página só precisa renderizar o conteúdo específico do dashboard.
  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-primary">
        Dashboard de {user.business.name}
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        Olá, {user.name.split(' ')[0]}! Aqui estão suas informações.
      </p>
      {/* O resto dos seus cards e informações não interativas do dashboard */}
    </div>
  );
}
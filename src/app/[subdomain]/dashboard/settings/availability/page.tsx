// Caminho: src/app/[subdomain]/dashboard/settings/availability/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import AvailabilityView from './_components/AvailabilityView'; // Vamos criar este ficheiro a seguir

// Função para buscar a disponibilidade atual do usuário logado
async function getAvailabilityData(userId: string) {
  const availability = await prisma.availability.findMany({
    where: { userId },
    orderBy: { dayOfWeek: 'asc' },
  });
  
  return availability;
}

export default async function AvailabilityPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session) {
    redirect('/login');
  }

  const availabilityData = await getAvailabilityData(session.userId);

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings" className="p-2 rounded-full text-brand-accent hover:bg-gray-100 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-brand-primary">
            Jornada de Trabalho
          </h1>
        </div>
        <p className="text-brand-accent mt-1 pl-14">
          Defina os seus dias e horários de atendimento padrão.
        </p>
      </header>
      
      {/* O componente de cliente receberá os dados de disponibilidade existentes */}
      <AvailabilityView initialAvailability={availabilityData} />
    </div>
  );
}
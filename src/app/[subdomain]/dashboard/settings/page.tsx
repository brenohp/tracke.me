// Caminho: src/app/[subdomain]/dashboard/settings/page.tsx

import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
// 1. Importa o ícone para Faturamento
import { Users, Building, UserCircle, Edit, Clock, CreditCard } from 'lucide-react'; 

async function getUserData(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, role: true }
    });
    return user;
}

export default async function SettingsPage() { 
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session) {
    redirect('/login');
  }

  const user = await getUserData(session.userId);

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">
          Configurações
        </h1>
        <p className="text-brand-accent mt-1">
          Gerencie seu perfil, equipe e as configurações do seu negócio.
        </p>
      </header>

      {/* Seção de Perfil */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-brand-primary mb-4 pb-2 border-b border-gray-200">
          Meu Perfil
        </h2>
        <div className="mt-4 p-6 bg-white rounded-lg shadow-md flex items-center justify-between">
            <div className='flex items-center gap-4'>
                <span className='bg-brand-accent-light p-4 rounded-full'>
                    <UserCircle size={32} className='text-brand-accent'/>
                </span>
                <div>
                    <p className="text-lg font-bold text-brand-primary">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
            </div>
            <Link
                href="/dashboard/settings/profile"
                className="flex items-center gap-2 bg-brand-accent text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-200"
            >
                <Edit size={16} />
                <span className="font-medium">Editar Perfil</span>
            </Link>
        </div>
      </section>

      {/* Seção de Administração do Negócio */}
      {user?.role === 'OWNER' && (
        <section>
          <h2 className="text-2xl font-semibold text-brand-primary mb-4 pb-2 border-b border-gray-200">
            Gestão do Negócio
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            
            {/* Card: Horários e Disponibilidade */}
            <Link
              href="/dashboard/settings/availability"
              className="group block p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <span className="bg-brand-accent-light p-3 rounded-full">
                  <Clock className="text-brand-accent" size={24} />
                </span>
                <span className="text-xs font-semibold text-gray-400 group-hover:text-brand-accent transition-colors">
                  IR &rarr;
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-brand-primary">Jornada de Trabalho</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Defina seus horários de atendimento.
                </p>
              </div>
            </Link>

            {/* Card de Gerenciar Equipe */}
            <Link 
              href="/dashboard/team"
              className="group block p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <span className="bg-brand-accent-light p-3 rounded-full">
                  <Users className="text-brand-accent" size={24} />
                </span>
                <span className="text-xs font-semibold text-gray-400 group-hover:text-brand-accent transition-colors">
                  IR &rarr;
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-brand-primary">Gerenciar Equipe</h3>
                <p className="text-sm text-gray-600 mt-1">Adicione ou remova membros da sua equipe.</p>
              </div>
            </Link>

            {/* Card: Dados do Negócio */}
            <Link
              href="/dashboard/settings/business"
              className="group block p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <span className="bg-brand-accent-light p-3 rounded-full">
                  <Building className="text-brand-accent" size={24} />
                </span>
                <span className="text-xs font-semibold text-gray-400 group-hover:text-brand-accent transition-colors">
                  IR &rarr;
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-brand-primary">Dados do Negócio</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Gerencie o nome e contato do seu negócio.
                </p>
              </div>
            </Link>

            {/* 2. NOVO CARD DE FATURAMENTO ADICIONADO AQUI */}
            <Link
              href="/dashboard/settings/billing" // Futura página de faturamento
              className="group block p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <span className="bg-brand-accent-light p-3 rounded-full">
                  <CreditCard className="text-brand-accent" size={24} />
                </span>
                <span className="text-xs font-semibold text-gray-400 group-hover:text-brand-accent transition-colors">
                  IR &rarr;
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-brand-primary">Assinatura</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Gerencie sua assinatura e pagamentos.
                </p>
              </div>
            </Link>

          </div>
        </section>
      )}
    </div>
  );
}
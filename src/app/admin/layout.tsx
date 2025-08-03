// Caminho: src/app/admin/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import { AdminSidebar } from './_components/AdminSidebar'; // Importa a nova sidebar

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* A nossa nova barra lateral */}
      <AdminSidebar />
      
      {/* Contêiner principal para o conteúdo da página */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 h-20 flex items-center justify-end">
          {/* No futuro, podemos adicionar um menu de perfil de admin aqui */}
          <span className="text-gray-600">Logado como Admin</span>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
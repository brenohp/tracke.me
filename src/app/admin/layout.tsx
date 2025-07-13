// Caminho: src/app/admin/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';

export default async function AdminLayout({ // Adicionado 'async'
  children,
}: {
  children: React.ReactNode;
}) {
  // CORREÇÃO: Adicionado 'await'
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-brand-primary text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Painel de Administrador - Tracke.me</h1>
      </header>
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}
// Caminho: src/app/[subdomain]/dashboard/_components/DashboardShell.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, type ReactNode } from 'react';
import { Menu, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { SidebarNav } from './SidebarNav';
import { usePathname } from 'next/navigation';
import { UserProfile } from './UserProfile';
import { AuthProvider } from '@/contexts/SessionProvider';
import type { PlanPermissions } from '../layout';
import { NotificationBell } from './NotificationBell';
// 1. Importamos nosso novo componente de banner
import { VerificationBanner } from './VerificationBanner'; 

// Definimos o tipo dos dados do usuário que vamos receber
interface UserData {
  email: string;
  emailVerified: Date | null;
}

// Adicionamos a propriedade 'user' às props do componente
export function DashboardShell({ children, permissions, user }: { children: ReactNode, permissions: PlanPermissions, user: UserData }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // 2. Criamos uma variável para verificar se o usuário não está verificado
  const isEmailUnverified = user && !user.emailVerified;

  return (
    <AuthProvider>
      <div className="flex h-screen bg-brand-background">
        <aside 
          className={`bg-brand-primary text-white flex flex-col transition-all duration-300 ease-in-out fixed inset-y-0 left-0 z-30 md:relative md:translate-x-0 ${
            isSidebarOpen ? 'w-64' : 'w-20'
          } ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className={`flex items-center p-4 h-16 border-b border-white/10 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
            <Link href="/dashboard" className={`text-2xl font-semibold text-white transition-opacity duration-200 ${!isSidebarOpen && 'hidden'}`}>
              CliendaApp
            </Link>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-300 hover:text-white hidden md:block">
              {isSidebarOpen ? <PanelLeftClose size={24} /> : <PanelRightClose size={24} />}
            </button>
          </div>
          <SidebarNav isSidebarOpen={isSidebarOpen} permissions={permissions} />
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm p-4 flex justify-between items-center h-16">
            <div className="flex items-center">
              <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600 md:hidden mr-4">
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-semibold text-brand-primary">
                Painel de Controle
              </h1>
            </div>
            
            <div className="flex items-center gap-6">
              <NotificationBell />
              <UserProfile />
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {/* 3. Renderizamos o banner condicionalmente */}
            {isEmailUnverified && <VerificationBanner userEmail={user.email} />}
            
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
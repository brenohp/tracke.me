// Caminho: src/app/[subdomain]/dashboard/_components/DashboardShell.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, type ReactNode } from 'react';
import { Menu, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { SidebarNav } from './SidebarNav';
import { usePathname } from 'next/navigation';
import { UserProfile } from './UserProfile';
import { AuthProvider } from '@/contexts/SessionProvider';
import type { PlanPermissions } from '../layout'; // 1. Importar o tipo

// 2. Adicionar 'permissions' às props do componente
export function DashboardShell({ children, permissions }: { children: ReactNode, permissions: PlanPermissions }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <AuthProvider>
      <div className="flex h-screen bg-brand-background">
        <div 
          className={`fixed inset-0 z-20 bg-black/50 transition-opacity duration-300 md:hidden ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        <aside 
          className={`bg-brand-primary text-white flex flex-col transition-all duration-300 ease-in-out fixed inset-y-0 left-0 z-30 md:relative md:translate-x-0 ${
            isSidebarOpen ? 'w-64' : 'w-20'
          } ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div 
            className={`flex items-center p-4 h-16 border-b border-white/10 ${
              isSidebarOpen ? 'justify-between' : 'justify-center'
            }`}
          >
            <Link href="/dashboard" className={`text-2xl font-semibold text-white transition-opacity duration-200 ${!isSidebarOpen && 'hidden'}`}>
              Tracke.me
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="text-gray-300 hover:text-white hidden md:block"
            >
              {isSidebarOpen ? <PanelLeftClose size={24} /> : <PanelRightClose size={24} />}
            </button>
          </div>

          {/* =================================================================== */}
          {/* 3. Passar a prop 'permissions' para o SidebarNav                  */}
          {/* =================================================================== */}
          <SidebarNav isSidebarOpen={isSidebarOpen} permissions={permissions} />

        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm p-4 flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-600 md:hidden mr-4"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-semibold text-brand-primary">
                Painel de Controle
              </h1>
            </div>
            
            <UserProfile />
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
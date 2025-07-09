// src/app/[subdomain]/dashboard/_components/SidebarNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, Calendar, Briefcase, UsersRound } from 'lucide-react';

const navLinks = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { href: '/dashboard/agenda', label: 'Agenda', icon: Calendar },
  { href: '/dashboard/services', label: 'Serviços', icon: Briefcase },
  { href: '/dashboard/clients', label: 'Clientes', icon: Users },
  { href: '/dashboard/team', label: 'Equipe', icon: UsersRound },
];

const footerLinks = [
  { href: '/dashboard/settings', label: 'Configurações', icon: Settings }
];

export function SidebarNav({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full justify-between p-2"> 
      <nav className="space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href; // Usamos correspondência exata para o painel
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 py-2.5 rounded-lg transition duration-200 ${
                isSidebarOpen ? 'px-4' : 'justify-center'
              } ${
                isActive
                  ? 'bg-brand-accent text-white'
                  : 'text-gray-300 hover:bg-brand-accent/50 hover:text-white'
              }`}
            >
              <link.icon size={20} />
              <span className={`transition-all duration-300 ${!isSidebarOpen ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1"> 
        {footerLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 py-2.5 rounded-lg transition duration-200 ${
                isSidebarOpen ? 'px-4' : 'justify-center'
              } ${
                isActive
                  ? 'bg-brand-accent text-white'
                  : 'text-gray-300 hover:bg-brand-accent/50 hover:text-white'
              }`}
            >
              <link.icon size={20} />
              <span className={`transition-all duration-300 ${!isSidebarOpen ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
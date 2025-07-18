// Caminho: src/app/admin/_components/AdminSidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  type LucideIcon,
  LayoutDashboard, 
  Building, 
  Users, 
  CreditCard,
  BadgeDollarSign,
  LineChart,
  Megaphone
} from 'lucide-react';

interface NavLinkItem {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
}

interface NavLinkProps {
  link: NavLinkItem;
}

// Componente de Link reutilizável
function NavLink({ link }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === link.href;
  return (
    <Link
      key={link.label}
      href={link.href}
      // CORREÇÃO: Removido 'gap-3' para um controlo mais explícito
      className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
        ${isActive 
          ? 'bg-brand-accent text-white' 
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
        ${link.soon ? 'cursor-not-allowed opacity-60' : ''}  
      `}
      onClick={(e) => link.soon && e.preventDefault()}
    >
      <link.icon className="h-5 w-5 flex-shrink-0" />
      {/* CORREÇÃO: Adicionado 'truncate' e espaçamento explícito */}
      <span className="ml-3 truncate">{link.label}</span>
      {link.soon && (
        // CORREÇÃO: Adicionado 'whitespace-nowrap' para garantir que a etiqueta não quebre
        <span className="ml-auto whitespace-nowrap text-xs bg-purple-200 text-purple-800 font-bold px-2 py-0.5 rounded-full">
          em breve
        </span>
      )}
    </Link>
  );
}

export function AdminSidebar() {
  const navLinks: NavLinkItem[] = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/businesses', label: 'Negócios', icon: Building },
    { href: '/admin/users', label: 'Usuários', icon: Users },
    { href: '/admin/plans', label: 'Planos', icon: CreditCard, soon: true },
    { href: '#', label: 'Assinaturas', icon: BadgeDollarSign, soon: true },
    { href: '#', label: 'Analytics', icon: LineChart, soon: true },
    { href: '#', label: 'Comunicação', icon: Megaphone, soon: true },
  ];
  
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-6 h-20 flex items-center border-b border-gray-700">
        <Link href="/admin" className="text-2xl font-semibold text-white">
          Tracke.me <span className="text-sm font-normal text-brand-accent">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink key={link.label} link={link} />
        ))}
      </nav>
    </aside>
  );
}
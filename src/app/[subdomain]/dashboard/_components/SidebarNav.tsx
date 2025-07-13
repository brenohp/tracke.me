// Caminho: src/app/[subdomain]/dashboard/_components/SidebarNav.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  type LucideIcon,
  LayoutDashboard, 
  Users, 
  Box, 
  Settings, 
  CircleDollarSign,
  Boxes,
  CalendarDays,
  Package // 1. Ícone para Pacotes
} from 'lucide-react';

interface SidebarNavProps {
  isSidebarOpen: boolean;
}

interface NavLinkItem {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
}

interface NavLinkProps {
  link: NavLinkItem;
  isSidebarOpen: boolean;
  pathname: string;
}

// Lista para os links principais de navegação
const managementLinks: NavLinkItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/schedule', label: 'Agenda', icon: CalendarDays },
  { href: '/dashboard/services', label: 'Serviços', icon: Box },
  { href: '/dashboard/clients', label: 'Clientes', icon: Users },
  { href: '/dashboard/team', label: 'Equipe', icon: Users },
];

// 2. Novo link para Pacotes adicionado
const resourcesLinks: NavLinkItem[] = [
  { href: '#', label: 'Pacotes', icon: Package, soon: true },
  { href: '#', label: 'Faturamento', icon: CircleDollarSign, soon: true },
  { href: '#', label: 'Estoque', icon: Boxes, soon: true },
];

const footerNavLinks: NavLinkItem[] = [
    { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
];

// Componente de Link reutilizável
function NavLink({ link, isSidebarOpen, pathname }: NavLinkProps) {
  const isActive = pathname === link.href;
  return (
    <Link
      key={link.label}
      href={link.href}
      className={`flex items-center rounded-md text-sm font-medium transition-colors duration-200
        ${isSidebarOpen ? 'px-4 py-2' : 'p-4 justify-center'}
        ${isActive 
          ? 'bg-brand-accent text-white' 
          : 'text-gray-300 hover:bg-white/10 hover:text-white'}
        ${link.soon ? 'cursor-not-allowed opacity-60' : ''}  
      `}
      onClick={(e) => link.soon && e.preventDefault()}
    >
      <link.icon className="h-5 w-5" />
      <span className={`transition-all duration-300 ${isSidebarOpen ? 'ml-3' : 'hidden'}`}>
        {link.label}
      </span>
      {link.soon && isSidebarOpen && (
        <span className="ml-auto text-xs bg-purple-200 text-purple-800 font-bold px-2 py-0.5 rounded-full">
          em breve
        </span>
      )}
    </Link>
  );
}

export function SidebarNav({ isSidebarOpen }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col flex-1 p-2">
      <div>
        <h3 className={`px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
          Gestão
        </h3>
        <div className="space-y-1">
          {managementLinks.map((link) => (
            <NavLink key={link.label} link={link} isSidebarOpen={isSidebarOpen} pathname={pathname} />
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className={`px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
          Recursos
        </h3>
        <div className="space-y-1">
          {resourcesLinks.map((link) => (
            <NavLink key={link.label} link={link} isSidebarOpen={isSidebarOpen} pathname={pathname} />
          ))}
        </div>
      </div>
      
      <div className="mt-auto space-y-1">
        <hr className={`border-white/10 my-2 ${!isSidebarOpen && 'mx-2'}`}/>
        {footerNavLinks.map((link) => (
            <NavLink key={link.label} link={link} isSidebarOpen={isSidebarOpen} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
}
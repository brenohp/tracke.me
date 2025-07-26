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
  Package
} from 'lucide-react';
import type { PlanPermissions } from '../layout'; // 1. Importar o tipo de permissões

interface SidebarNavProps {
  isSidebarOpen: boolean;
  permissions: PlanPermissions; // 2. Receber as permissões
}

interface NavLinkItem {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
  permissionKey?: keyof PlanPermissions; // 3. Chave para verificar a permissão
}

interface NavLinkProps {
  link: NavLinkItem;
  isSidebarOpen: boolean;
  pathname: string;
}

// Links de gestão (geralmente disponíveis para todos)
const managementLinks: NavLinkItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/schedule', label: 'Agenda', icon: CalendarDays },
  { href: '/dashboard/services', label: 'Serviços', icon: Box },
  { href: '/dashboard/clients', label: 'Clientes', icon: Users },
  { href: '/dashboard/team', label: 'Equipe', icon: Users },
];

// Links de recursos (agora ativados por permissão)
const resourcesLinks: NavLinkItem[] = [
  { href: '/dashboard/packages', label: 'Pacotes', icon: Package, permissionKey: 'hasPackages', soon: true },
  { href: '/dashboard/billing', label: 'Faturamento', icon: CircleDollarSign, permissionKey: 'hasBilling', soon: true },
  { href: '/dashboard/inventory', label: 'Estoque', icon: Boxes, permissionKey: 'hasInventory', soon: true },
];

const footerNavLinks: NavLinkItem[] = [
    { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
];

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

export function SidebarNav({ isSidebarOpen, permissions }: SidebarNavProps) {
  const pathname = usePathname();

  // ===================================================================
  // 4. FILTRAR OS LINKS DE RECURSOS COM BASE NAS PERMISSÕES RECEBIDAS
  // ===================================================================
  const availableResources = resourcesLinks.filter(link => {
    // Se o link não tiver uma chave de permissão, ele é sempre mostrado.
    if (!link.permissionKey) {
      return true; 
    }
    // Caso contrário, verifique se a permissão correspondente é 'true'.
    return permissions[link.permissionKey] === true;
  });
  // ===================================================================

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
      
      {/* 5. Renderizar a seção de Recursos apenas se houver links disponíveis */}
      {availableResources.length > 0 && (
        <div className="mt-4">
          <h3 className={`px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
            Recursos
          </h3>
          <div className="space-y-1">
            {availableResources.map((link) => (
              <NavLink key={link.label} link={link} isSidebarOpen={isSidebarOpen} pathname={pathname} />
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-auto space-y-1">
        <hr className={`border-white/10 my-2 ${!isSidebarOpen && 'mx-2'}`}/>
        {footerNavLinks.map((link) => (
            <NavLink key={link.label} link={link} isSidebarOpen={isSidebarOpen} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
}
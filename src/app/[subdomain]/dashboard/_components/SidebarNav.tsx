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
  Package,
  Sparkles,
  Megaphone,
  PiggyBank,
  BarChartHorizontal
} from 'lucide-react';
// A interface agora é importada corretamente do layout, que é a fonte da verdade.
import type { PlanPermissions } from '../layout';

// A declaração local de 'PlanPermissions' foi REMOVIDA para resolver o conflito.

interface SidebarNavProps {
  isSidebarOpen: boolean;
  permissions: PlanPermissions;
}

interface NavLinkItem {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
  permissionKey?: keyof PlanPermissions;
}

interface NavLinkProps {
  link: NavLinkItem;
  isSidebarOpen: boolean;
  pathname: string;
}

const managementLinks: NavLinkItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/schedule', label: 'Agenda', icon: CalendarDays },
  { href: '/dashboard/services', label: 'Serviços', icon: Box },
  { href: '/dashboard/clients', label: 'Clientes', icon: Users },
  { href: '/dashboard/team', label: 'Equipe', icon: Users },
];

const resourcesLinks: NavLinkItem[] = [
  { href: '/dashboard/automation', label: 'Automação IA', icon: Sparkles, permissionKey: 'hasAutomation', soon: true },
  { href: '/dashboard/packages', label: 'Pacotes', icon: Package, permissionKey: 'hasPackages', soon: true },
  { href: '/dashboard/inventory', label: 'Estoque', icon: Boxes, permissionKey: 'hasInventory', soon: true },
];

const marketingLinks: NavLinkItem[] = [
  { href: '#', label: 'Campanhas', icon: Megaphone, permissionKey: 'hasMarketing', soon: true },
];

const analyticsLinks: NavLinkItem[] = [
  { href: '/dashboard/billing', label: 'Faturamento', icon: CircleDollarSign, permissionKey: 'hasBilling', soon: true },
  { href: '#', label: 'Financeiro', icon: PiggyBank, permissionKey: 'hasReports', soon: true },
  { href: '#', label: 'Relatórios', icon: BarChartHorizontal, permissionKey: 'hasReports', soon: true },
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

  const filterLinks = (links: NavLinkItem[]) => {
    return links.filter(link => {
      if (!link.permissionKey) return true;
      return permissions[link.permissionKey] === true;
    });
  };

  const availableResources = filterLinks(resourcesLinks);
  const availableMarketing = filterLinks(marketingLinks);
  const availableAnalytics = filterLinks(analyticsLinks);

  return (
    <nav className="flex flex-col flex-1 p-2 overflow-y-auto">
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

      {availableMarketing.length > 0 && (
        <div className="mt-4">
          <h3 className={`px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
            Marketing
          </h3>
          <div className="space-y-1">
            {availableMarketing.map((link) => (
              <NavLink key={link.label} link={link} isSidebarOpen={isSidebarOpen} pathname={pathname} />
            ))}
          </div>
        </div>
      )}

      {availableAnalytics.length > 0 && (
        <div className="mt-4">
          <h3 className={`px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider ${!isSidebarOpen && 'hidden'}`}>
            Análise
          </h3>
          <div className="space-y-1">
            {availableAnalytics.map((link) => (
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
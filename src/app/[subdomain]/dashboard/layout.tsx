// Caminho: src/app/[subdomain]/dashboard/layout.tsx

import { DashboardShell } from './_components/DashboardShell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // O AuthProvider e toda a lógica interativa foram movidos para o DashboardShell
  return <DashboardShell>{children}</DashboardShell>;
}
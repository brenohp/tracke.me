// src/app/admin/_components/AdminHeader.tsx
"use client";

import { AuthProvider, useAuth } from '@/contexts/SessionProvider';
import { LogOut, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Componente interno que consome o contexto de autenticação
function HeaderContent() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return <LoaderCircle className="animate-spin text-brand-accent" />;
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">
        Logado como <span className="font-semibold">{user?.name || 'Admin'}</span>
      </span>
      <Button variant="outline" size="sm" onClick={logout}>
        <LogOut className="h-4 w-4 mr-2" />
        Sair
      </Button>
    </div>
  );
}

// Componente principal que exportamos, envolvendo o conteúdo com o Provider
// Isso garante que o HeaderContent tenha acesso ao contexto de autenticação
export function AdminHeader() {
  return (
    <AuthProvider>
      <header className="bg-white shadow-sm p-4 h-20 flex items-center justify-end">
        <HeaderContent />
      </header>
    </AuthProvider>
  );
}
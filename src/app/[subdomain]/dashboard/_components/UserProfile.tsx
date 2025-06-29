// src/app/[subdomain]/dashboard/_components/UserProfile.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/SessionProvider'; // 1. USA NOSSO HOOK
import Link from 'next/link';
import { User, LogOut, Settings, LoaderCircle } from 'lucide-react';

export function UserProfile() {
  // 2. Pega os dados do nosso contexto em vez do useSession
  const { user, isLoading, logout } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Enquanto os dados do usuário estão carregando, mostramos um loader
  if (isLoading) {
    return <LoaderCircle className="animate-spin text-brand-accent" />;
  }

  // Se não houver usuário após o carregamento, não renderiza nada
  if (!user) {
    return null; 
  }

  const userInitial = user.name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-brand-accent-light flex items-center justify-center text-brand-primary font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
      >
        {userInitial}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
          <div className="px-4 py-2 border-b">
            {/* 3. Usa os dados do nosso objeto 'user' */}
            <p className="font-semibold text-brand-primary truncate">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/dashboard/settings/profile" 
              className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User className="mr-3" size={16} /> Meu Perfil
            </Link>
            <Link
              href="/dashboard/settings"
              className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="mr-3" size={16} /> Configurações
            </Link>
          </div>
          <div className="py-1 border-t">
            {/* 4. Usa nossa função de logout */}
            <button
              onClick={logout} 
              className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3" size={16} /> Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
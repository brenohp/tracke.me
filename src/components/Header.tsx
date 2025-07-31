// Caminho: src/components/Header.tsx
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-40 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-brand-primary">
          CliendaApp
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-gray-600 hover:text-brand-accent transition-colors">Funcionalidades</Link>
          <Link href="#pricing" className="text-gray-600 hover:text-brand-accent transition-colors">Planos</Link>
          <Link href="#contact" className="text-gray-600 hover:text-brand-accent transition-colors">Contato</Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login" className="text-brand-accent font-semibold hover:underline">
            Entrar
          </Link>
          <Link href="#pricing" className="bg-brand-accent text-white px-5 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
            Começar Grátis
          </Link>
        </div>

        {/* Botão do Menu Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-brand-primary">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col items-center space-y-4 py-6">
            <Link href="#features" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-brand-accent transition-colors">Funcionalidades</Link>
            <Link href="#pricing" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-brand-accent transition-colors">Planos</Link>
            <Link href="#contact" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-brand-accent transition-colors">Contato</Link>
            <hr className="w-4/5"/>
            <Link href="/login" onClick={() => setIsOpen(false)} className="text-brand-accent font-semibold hover:underline">
              Entrar
            </Link>
            <Link href="#pricing" onClick={() => setIsOpen(false)} className="w-4/5 text-center bg-brand-accent text-white px-5 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
              Começar Grátis
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
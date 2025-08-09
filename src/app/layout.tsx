// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// ===================================================================
// METADADOS ATUALIZADOS PARA MELHOR SEO
// ===================================================================
export const metadata: Metadata = {
  // O título que aparece na aba do navegador e como link principal no Google
  title: {
    template: '%s | CliendaApp',
    default: 'CliendaApp - Agenda Inteligente e Automação para o seu Negócio',
  },
  // A descrição que aparece debaixo do link no Google. É o seu "anúncio".
  description: "Poupe horas por dia com o CliendaApp. A nossa IA agenda por si no WhatsApp, reduz as faltas e organiza a sua base de clientes. Ideal para salões, barbearias e estúdios.",
  // Palavras-chave que ajudam o Google a entender o seu nicho.
  keywords: [
    "agenda online", 
    "agendamento para salão de beleza", 
    "sistema para barbearia", 
    "software para esteticista", 
    "gestão de clientes", 
    "automação whatsapp",
    "agenda inteligente"
  ],
};
// ===================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
          }}
        />
        {children}
      </body>
    </html>
  );
}
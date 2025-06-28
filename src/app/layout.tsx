// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast"; // <-- 1. IMPORTE
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tracke.me",
  description: "Simplificando a gestão do seu negócio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Toaster // <-- 2. ADICIONE
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
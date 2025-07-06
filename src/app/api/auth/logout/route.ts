// Caminho do arquivo: src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // --- INÍCIO DA CORREÇÃO ---
  // Remove a porta do domínio para o cookie
  const appDomain = (process.env.NEXT_PUBLIC_APP_DOMAIN || 'lvh.me:3000').split(':')[0];
  const domain = process.env.NODE_ENV === 'production' ? `.${appDomain}` : appDomain;

  const serializedCookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1,
    path: '/',
    domain: domain, // <-- Agora está correto: 'lvh.me'
    expires: new Date(0),
  });
  // --- FIM DA CORREÇÃO ---

  const response = NextResponse.json({ message: 'Logout bem-sucedido.' });
  response.headers.set('Set-Cookie', serializedCookie);
  return response;
}
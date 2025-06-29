// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export const config = {
  // O matcher agora pega todas as rotas, pois o middleware precisa
  // decidir o que fazer baseado no hostname (subdomínio).
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host')!;

  // Define o domínio principal da aplicação. Em produção, será 'tracke.me'.
  // Para desenvolvimento, usamos 'localhost:3000'.
  const appDomain = 'localhost:3000'; 

  // Extrai o subdomínio do hostname.
  // Ex: de "negocio1.localhost:3000", extrai "negocio1".
  const subdomain = hostname.replace(`.${appDomain}`, '');
  
  // Se estiver no domínio principal (sem subdomínio), não fazemos nada.
  // Deixamos o usuário acessar a home, login, register, etc.
  if (hostname === appDomain) {
    return NextResponse.next();
  }

  // Se o caminho já for o do subdomínio (ex: /login), não reescrevemos.
  if (url.pathname.startsWith(`/${subdomain}`)) {
    return NextResponse.next();
  }

  // Se chegou até aqui, significa que o usuário está em um subdomínio.
  // Vamos reescrever a URL para que o Next.js entenda.
  // Ex: Acessar "negocio1.localhost:3000/dashboard" será tratado internamente
  // como se fosse "/negocio1/dashboard", permitindo usar layouts e páginas dinâmicas.
  const newUrl = new URL(`/${subdomain}${url.pathname}`, req.url);
  return NextResponse.rewrite(newUrl);
}
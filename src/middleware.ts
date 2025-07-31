// Caminho: src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/session';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host')!;
  
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'lvh.me:3000'; // Será 'tracke.me'
  const protocol = req.nextUrl.protocol;

  const token = req.cookies.get('token')?.value;
  const session = verifyToken(token || '');

  // Lógica de proteção para a rota /admin
  if (url.pathname.startsWith('/admin')) {
    // Se não houver sessão ou a função não for ADMIN, redireciona para o login
    if (!session || session.role !== 'ADMIN') {
      const loginUrl = new URL('/login', `${protocol}//${hostname}`); // Redireciona para o login no mesmo host
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
    
    // Se for admin, permite o acesso. O redirecionamento de domínio já é feito pela Vercel.
    return NextResponse.next();
  }

  // Lógica para subdomínios de clientes
  if (hostname !== appDomain && hostname !== `www.${appDomain}`) {
    const subdomain = hostname.replace(`.${appDomain}`, '');
    url.pathname = `/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  // Para todas as outras rotas no domínio principal
  return NextResponse.next();
}
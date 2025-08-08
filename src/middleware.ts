// Caminho: src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/session';
// A importação do Prisma não é mais necessária aqui

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host')!;
  
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'lvh.me:3000';
  const protocol = req.nextUrl.protocol;

  const token = req.cookies.get('token')?.value;
  const session = await verifyToken(token || '');
  const { pathname } = url;

  // Se o usuário tem uma sessão e está tentando acessar login/registro, redireciona para o dashboard
  if (session && (pathname === '/login' || pathname === '/register' || pathname === '/checkout')) {
    const dashboardUrl = new URL(`/dashboard`, `${protocol}//${session.subdomain}.${appDomain}`);
    return NextResponse.redirect(dashboardUrl);
  }

  // A lógica de proteção do admin continua a mesma
  if (pathname.startsWith('/admin')) {
    if (!session || session.role !== 'ADMIN') {
      const loginUrl = new URL('/login', `${protocol}//${hostname}`);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Lógica de subdomínio e proteção do dashboard
  if (hostname !== appDomain && hostname !== `www.${appDomain}`) {
    // Estamos em um subdomínio de cliente.
    
    // Protege todas as rotas do dashboard
    if (pathname.startsWith('/dashboard')) {
      if (!session) {
        // Se não houver sessão, redireciona para a página de login principal.
        const loginUrl = new URL('/login', `${protocol}//${appDomain}`);
        loginUrl.searchParams.set('next', url.pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // ===================================================================
      // O BLOCO DE VERIFICAÇÃO DE E-MAIL FOI REMOVIDO DAQUI
      // ===================================================================
    }

    const subdomain = hostname.replace(`.${appDomain}`, '');
    url.pathname = `/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}
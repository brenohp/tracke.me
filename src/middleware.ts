// Caminho: src/app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  // O matcher exclui ficheiros estáticos e rotas de API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host')!;
  
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'lvh.me:3000';
  const protocol = req.nextUrl.protocol;

  // --- LÓGICA CORRIGIDA ---

  // Se a rota for /admin, ela deve SEMPRE estar no domínio principal.
  if (url.pathname.startsWith('/admin')) {
    // Se o acesso já é pelo domínio principal, permite continuar.
    if (hostname === appDomain) {
      return NextResponse.next();
    }
    // Se o acesso é por um subdomínio, redireciona para o /admin no domínio principal.
    const adminUrl = new URL('/admin', `${protocol}//${appDomain}`);
    return NextResponse.redirect(adminUrl);
  }

  // Se o acesso é para um subdomínio (e não é a rota /admin)
  if (hostname !== appDomain) {
    const subdomain = hostname.replace(`.${appDomain}`, '');
    url.pathname = `/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  // Para todos os outros casos no domínio principal (/, /login, etc.), permite o acesso.
  return NextResponse.next();
}
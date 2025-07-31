// Caminho: src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host')!;
  
  // Usamos a variável de ambiente, com um fallback para desenvolvimento local
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'lvh.me:3000';
  const protocol = req.nextUrl.protocol;

  // Se o acesso for para o /admin, ele deve SEMPRE estar no domínio principal.
  if (url.pathname.startsWith('/admin')) {
    // Se o hostname atual NÃO for o domínio principal, redireciona para lá.
    if (hostname !== appDomain) {
      const adminUrl = new URL(url.pathname, `${protocol}//${appDomain}`);
      return NextResponse.redirect(adminUrl);
    }
    // Se já estiver no domínio principal, permite continuar.
    return NextResponse.next();
  }

  // --- LÓGICA CORRIGIDA PARA TRATAR WWW ---
  // Verifica se o hostname é o domínio raiz OU o domínio www.
  // Se for um deles, trata como o site principal e permite o acesso.
  if (hostname === appDomain || hostname === `www.${appDomain}`) {
    return NextResponse.next();
  }

  // Se não for o domínio principal nem o www, é um subdomínio de cliente.
  // Reescreve a URL para o formato de rota dinâmica.
  const subdomain = hostname.replace(`.${appDomain}`, '');
  url.pathname = `/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}
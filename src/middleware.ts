// Caminho do arquivo: src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host')!;
  
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'lvh.me:3000';

  // Permite o acesso ao domínio principal (lvh.me:3000)
  if (hostname === appDomain) {
    return NextResponse.next();
  }

  // Lógica para SUBDOMÍNIOS
  const subdomain = hostname.replace(`.${appDomain}`, '');
  const path = url.pathname;

  // Evita o loop de reescrita
  if (path.startsWith(`/${subdomain}`)) {
    return NextResponse.next();
  }
  
  const token = req.cookies.get('token')?.value;

  if (!token) {
    // Se não há token, redireciona para o login no domínio principal
    const protocol = req.nextUrl.protocol;
    const loginUrl = new URL('/login', `${protocol}//${appDomain}`);
    return NextResponse.redirect(loginUrl);
  }

  // Se há token, reescreve a URL para o Next.js encontrar a página
  url.pathname = `/${subdomain}${path}`;
  return NextResponse.rewrite(url);
}
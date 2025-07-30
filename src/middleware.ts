// Caminho: src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host')!;
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN; // Removi o valor reserva para um debug mais limpo

  // --- LOGS PARA DEPURAÇÃO EM TEMPO REAL ---
  console.log('--- Middleware Executado ---');
  console.log('Hostname da Requisição:', hostname);
  console.log('APP_DOMAIN (da Vercel):', appDomain);
  console.log('A comparação (hostname === appDomain) resulta em:', hostname === appDomain);
  console.log('---------------------------');

  const protocol = req.nextUrl.protocol;

  if (url.pathname.startsWith('/admin')) {
    if (hostname === appDomain) {
      return NextResponse.next();
    }
    const adminUrl = new URL('/admin', `${protocol}//${appDomain}`);
    return NextResponse.redirect(adminUrl);
  }

  if (hostname !== appDomain) {
    const subdomain = hostname.replace(`.${appDomain}`, '');
    url.pathname = `/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}
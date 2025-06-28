// src/app/api/services/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';

export async function POST(request: Request) {
  // Forma robusta de ler o header, diretamente do objeto da requisição
  const authorization = request.headers.get('authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Token de autorização ausente ou malformatado.' }, { status: 401 });
  }
  const token = authorization.split(' ')[1];

  const session = verifyToken(token);

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado. Token inválido ou expirado.' }, { status: 401 });
  }

  if (session.role !== 'OWNER' && session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado. Permissões insuficientes.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, price, duration } = body;

    if (!name || !price || !duration) {
      return NextResponse.json({ message: 'Nome, preço e duração são obrigatórios.' }, { status: 400 });
    }

    const newService = await prisma.service.create({
      data: {
        name,
        description,
        price,
        duration,
        userId: session.userId,
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Nova função para lidar com requisições GET para /api/services
export async function GET(request: Request) {
  // 1. Protegendo a rota, exatamente como fizemos no POST
  const authorization = request.headers.get('authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Token de autorização ausente ou malformatado.' }, { status: 401 });
  }
  const token = authorization.split(' ')[1];
  const session = verifyToken(token);

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado. Token inválido ou expirado.' }, { status: 401 });
  }

  try {
    // 2. Busca no banco TODOS os serviços ONDE o userId é igual ao do usuário logado
    const services = await prisma.service.findMany({
      where: {
        userId: session.userId, // Este filtro é a chave para a segurança dos dados!
      },
      orderBy: {
        createdAt: 'desc', // Opcional: ordena os serviços do mais novo para o mais antigo
      },
    });

    // 3. Retorna a lista de serviços encontrados
    return NextResponse.json(services, { status: 200 });

  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor.' },
      { status: 500 }
    );
  }
}
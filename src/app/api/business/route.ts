// Caminho: src/app/api/business/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session) {
    return NextResponse.json({ message: 'Acesso não autorizado.' }, { status: 401 });
  }

  try {
    // 1. Extrair todos os campos do corpo da requisição, incluindo o endereço
    const { 
      name, 
      phone,
      addressStreet,
      addressNumber,
      addressComplement,
      addressNeighborhood,
      addressCity,
      addressState,
      addressZipCode,
    } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'O nome do negócio é obrigatório.' }, { status: 400 });
    }

    // ===================================================================
    // 2. LÓGICA DE VALIDAÇÃO DE NOME ÚNICO
    // ===================================================================
    const existingBusiness = await prisma.business.findFirst({
      where: {
        // Busca por um nome igual (ignorando maiúsculas/minúsculas)
        name: {
          equals: name,
          mode: 'insensitive'
        },
        // Garante que não seja o próprio negócio que estamos editando
        id: {
          not: session.businessId,
        },
      },
    });

    // Se encontrou outro negócio com o mesmo nome, retorna um erro de conflito
    if (existingBusiness) {
      return NextResponse.json({ message: 'Este nome de negócio já está em uso. Por favor, escolha outro.' }, { status: 409 });
    }
    // ===================================================================

    // 3. Atualiza o negócio no banco de dados com todos os novos campos
    await prisma.business.update({
      where: {
        id: session.businessId,
      },
      data: {
        name,
        phone,
        addressStreet,
        addressNumber,
        addressComplement,
        addressNeighborhood,
        addressCity,
        addressState,
        addressZipCode,
      },
    });

    revalidatePath('/dashboard/settings/business');

    return NextResponse.json({ message: 'Dados atualizados com sucesso!' }, { status: 200 });

  } catch (error) {
    console.error("Erro ao atualizar dados do negócio:", error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}
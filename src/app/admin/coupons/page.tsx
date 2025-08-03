// Caminho: src/app/admin/coupons/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import CouponsView from './_components/CouponsView'; // Vamos criar este ficheiro a seguir

// Função para buscar os dados de todos os cupões no servidor
async function getCouponsData() {
  const coupons = await prisma.coupon.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return coupons;
}

export default async function AdminCouponsPage() {
  // Segurança
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  const coupons = await getCouponsData();

  // Converte os dados para um formato serializável
  const serializableCoupons = coupons.map(coupon => ({
    ...coupon,
    discountValue: coupon.discountValue ? coupon.discountValue.toString() : null,
    expiresAt: coupon.expiresAt ? coupon.expiresAt.toISOString() : null,
    createdAt: coupon.createdAt.toISOString(),
  }));

  return <CouponsView coupons={serializableCoupons} />;
}
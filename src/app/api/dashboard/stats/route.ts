// Caminho: src/app/api/dashboard/stats/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth
} from 'date-fns'; // CORREÇÃO: 'sub' foi removido

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const period = searchParams.get('period') || 'month';

    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case 'day':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
    }

    const [totalAppointments, completedAppointments, canceledAppointments] = await Promise.all([
      prisma.appointment.count({
        where: {
          service: { businessId: session.businessId },
          startTime: { gte: startDate, lt: endDate },
        },
      }),
      prisma.appointment.count({
        where: {
          service: { businessId: session.businessId },
          status: 'COMPLETED',
          startTime: { gte: startDate, lt: endDate },
        },
      }),
      prisma.appointment.count({
        where: {
          service: { businessId: session.businessId },
          status: 'CANCELED',
          startTime: { gte: startDate, lt: endDate },
        },
      }),
    ]);

    const stats = {
      totalAppointments,
      completedAppointments,
      canceledAppointments,
    };

    return NextResponse.json(stats, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor.' },
      { status: 500 }
    );
  }
}
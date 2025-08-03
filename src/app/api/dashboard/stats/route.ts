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
} from 'date-fns';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

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

    const whereClause = {
      service: { businessId: session.businessId },
      startTime: { gte: startDate, lt: endDate },
    };

    // 1. As contagens de status agora usam a 'whereClause' reutilizável
    const [totalAppointments, completedAppointments, canceledAppointments, confirmedAppointments] = await Promise.all([
      prisma.appointment.count({ where: whereClause }),
      prisma.appointment.count({ where: { ...whereClause, status: 'COMPLETED' } }),
      prisma.appointment.count({ where: { ...whereClause, status: 'CANCELED' } }),
      prisma.appointment.count({ where: { ...whereClause, status: 'CONFIRMED' } }),
    ]);

    // 2. Nova lógica para encontrar os serviços mais populares
    const popularServicesData = await prisma.appointment.groupBy({
      by: ['serviceId'],
      where: whereClause,
      _count: {
        serviceId: true,
      },
      orderBy: {
        _count: {
          serviceId: 'desc',
        },
      },
      take: 3, // Pega os 3 serviços do topo
    });

    // 3. Busca os nomes dos serviços com base nos IDs encontrados
    const serviceIds = popularServicesData.map(item => item.serviceId);
    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Mapeia o nome para cada resultado do groupBy
    const popularServices = popularServicesData.map(item => {
      const service = services.find(s => s.id === item.serviceId);
      return {
        serviceName: service?.name || 'Serviço desconhecido',
        count: item._count.serviceId,
      };
    });


    const stats = {
      totalAppointments,
      completedAppointments,
      canceledAppointments,
      confirmedAppointments,
      popularServices, // 4. Adiciona a nova informação à resposta
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
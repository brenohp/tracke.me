// Caminho: src/app/api/appointments/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { Prisma, Appointment } from '@prisma/client';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { addMinutes } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz'; // <<< IMPORTAÇÃO CORRIGIDA
import { NotificationService } from '@/lib/services/notification.service';

type AppointmentWithIncludes = Appointment & {
  client: { name: string };
  service: { name: string };
  professional: { name: string };
};

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { serviceId, clientId, professionalId, startTime } = body;

    if (!serviceId || !clientId || !professionalId || !startTime) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { id: session.businessId },
    });

    if (!business) {
      return NextResponse.json({ message: 'Negócio não encontrado.' }, { status: 404 });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ message: 'Serviço não encontrado.' }, { status: 404 });
    }

    const timeZone = business.timezone; 
    
    // <<< USO DA FUNÇÃO CORRIGIDA
    const startTimeDate = fromZonedTime(startTime, timeZone); 

    const endTimeDate = addMinutes(startTimeDate, service.durationInMinutes);

    const newAppointment = await prisma.appointment.create({
      data: {
        startTime: startTimeDate,
        endTime: endTimeDate,
        status: 'SCHEDULED',
        clientId,
        serviceId,
        professionalId,
      },
    });
    
    try {
      const [client, professional] = await Promise.all([
        prisma.client.findUnique({ where: { id: clientId } }),
        prisma.user.findUnique({ where: { id: professionalId } })
      ]);

      if (client && professional) {
        NotificationService.newAppointment(newAppointment, client, professional);
      }
    } catch (notificationError) {
      console.error("Falha ao disparar a notificação:", notificationError);
    }

    revalidatePath('/dashboard/schedule');
    return NextResponse.json(newAppointment, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor.' },
      { status: 500 }
    );
  }
}

// A função GET continua a mesma
export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const session = await verifyToken(token || '');

    if (!session || !session.businessId) {
        return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
    }

    try {
        const { searchParams } = request.nextUrl;
        const start = searchParams.get('start');
        const end = searchParams.get('end');
        const search = searchParams.get('search');

        const whereClause: Prisma.AppointmentWhereInput = {
            professional: {
                businessId: session.businessId,
            },
        };

        if (start && end) {
            whereClause.startTime = { gte: new Date(start) };
            whereClause.endTime = { lte: new Date(end) };
        }

        if (search) {
            whereClause.client = {
                name: {
                    contains: search,
                    mode: 'insensitive',
                },
            };
        }
        
        const appointments = await prisma.appointment.findMany({
            where: whereClause,
            include: {
                client: { select: { name: true } },
                service: { select: { name: true } },
                professional: { select: { name: true } },
            },
            orderBy: {
                startTime: 'desc',
            }
        });

        if (start && end) {
            const calendarEvents = appointments.map((apt: AppointmentWithIncludes) => ({
                id: apt.id,
                title: `${apt.client.name} - ${apt.service.name}`,
                start: apt.startTime.toISOString(),
                end: apt.endTime.toISOString(),
                extendedProps: {
                    status: apt.status,
                    clientId: apt.clientId,
                    serviceId: apt.serviceId,
                    professionalId: apt.professionalId,
                }
            }));
            return NextResponse.json(calendarEvents, { status: 200 });
        } else {
            return NextResponse.json(appointments, { status: 200 });
        }
        
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return NextResponse.json(
            { message: 'Ocorreu um erro no servidor.' },
            { status: 500 }
        );
    }
}
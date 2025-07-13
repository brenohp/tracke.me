// Caminho: src/app/[subdomain]/dashboard/schedule/_components/CalendarView.tsx
"use client";

import { useRef, useImperativeHandle, forwardRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { type EventSourceInput, type EventSourceFuncArg, type EventClickArg } from '@fullcalendar/core';
import { type DateClickArg } from '@fullcalendar/interaction';

interface CalendarViewProps {
  onDateClick: (arg: DateClickArg) => void;
  onEventClick: (arg: EventClickArg) => void;
}

// 1. O componente agora é envolvido por forwardRef para podermos passar uma ref a ele
const CalendarView = forwardRef(({ onDateClick, onEventClick }: CalendarViewProps, ref) => {
  const calendarRef = useRef<FullCalendar>(null);

  // 2. Expomos uma função 'refetchEvents' para o componente pai
  useImperativeHandle(ref, () => ({
    refetchEvents() {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.refetchEvents();
      }
    }
  }));

  const fetchEvents: EventSourceInput = async (fetchInfo: EventSourceFuncArg) => {
    const url = `/api/appointments?start=${fetchInfo.startStr}&end=${fetchInfo.endStr}`;
    try {
      const response = await fetch(url);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      return [];
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <FullCalendar
        ref={calendarRef} // 3. A ref é associada ao FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={ptBrLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        allDaySlot={false}
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        height="auto"
        nowIndicator={true}
        editable={true}
        selectable={true}
        events={fetchEvents}
        dateClick={onDateClick}
        eventClick={onEventClick}
        eventClassNames={(arg) => {
          const status = arg.event.extendedProps.status;
          switch (status) {
            case 'SCHEDULED':
              return ['status-scheduled'];
            case 'CONFIRMED':
              return ['status-confirmed'];
            case 'CANCELED':
              return ['status-canceled'];
            case 'COMPLETED':
              return ['status-completed'];
            default:
              return [];
          }
        }}
      />
    </div>
  );
});

// É necessário adicionar um displayName para o ESLint
CalendarView.displayName = 'CalendarView';

export default CalendarView;
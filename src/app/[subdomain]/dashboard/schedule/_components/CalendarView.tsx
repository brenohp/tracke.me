// Caminho: src/app/[subdomain]/dashboard/schedule/_components/CalendarView.tsx
"use client";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { type EventSourceInput, type EventSourceFuncArg } from '@fullcalendar/core';
// CORREÇÃO: Importa o DateClickArg do plugin de interação
import { type DateClickArg } from '@fullcalendar/interaction';

interface CalendarViewProps {
  onDateClick: (arg: DateClickArg) => void;
}

export default function CalendarView({ onDateClick }: CalendarViewProps) {
  const fetchEvents: EventSourceInput = async (fetchInfo: EventSourceFuncArg) => {
    const url = `/api/appointments?start=${fetchInfo.startStr}&end=${fetchInfo.endStr}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error('Falha ao buscar agendamentos:', response);
        return [];
      }
      const events = await response.json();
      return events;
    } catch (error) {
      console.error('Erro ao conectar à API de agendamentos:', error);
      return [];
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <FullCalendar
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
      />
    </div>
  );
}
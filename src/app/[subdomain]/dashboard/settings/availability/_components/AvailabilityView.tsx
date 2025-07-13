// Caminho: src/app/[subdomain]/dashboard/settings/availability/_components/AvailabilityView.tsx
"use client";

// 1. CORREÇÃO: Removido o 'useEffect' da importação
import { useState, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Tipos
interface Availability {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface AvailabilityViewProps {
  initialAvailability: Availability[];
}

// Helper para gerar as opções de horário
const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = (i % 2) * 30;
  const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  return time;
});

const weekDays = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
  'Quinta-feira', 'Sexta-feira', 'Sábado'
];

export default function AvailabilityView({ initialAvailability }: AvailabilityViewProps) {
  const router = useRouter();
  
  const [schedule, setSchedule] = useState(() => 
    weekDays.map((_, index) => {
      const dayData = initialAvailability.find(a => a.dayOfWeek === index);
      return {
        dayOfWeek: index,
        enabled: !!dayData,
        startTime: dayData?.startTime || '09:00',
        endTime: dayData?.endTime || '18:00',
      };
    })
  );
  
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleDay = (dayIndex: number) => {
    setSchedule(currentSchedule => 
      currentSchedule.map((day, index) => 
        index === dayIndex ? { ...day, enabled: !day.enabled } : day
      )
    );
  };

  const handleTimeChange = (dayIndex: number, type: 'startTime' | 'endTime', value: string) => {
    setSchedule(currentSchedule => 
      currentSchedule.map((day, index) => 
        index === dayIndex ? { ...day, [type]: value } : day
      )
    );
  };
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const activeSchedule = schedule
      .filter(day => day.enabled)
      .map(({ dayOfWeek, startTime, endTime }) => ({
        dayOfWeek,
        startTime,
        endTime,
      }));

    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeSchedule),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao guardar a disponibilidade.');
      }

      toast.success('Jornada de trabalho atualizada com sucesso!');
      router.refresh();

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        {schedule.map((day, index) => (
          <div key={index} className="grid grid-cols-3 items-center gap-4 p-4 border rounded-lg">
            <div className="col-span-1">
              <label htmlFor={`day-${index}`} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id={`day-${index}`}
                  checked={day.enabled}
                  onChange={() => handleToggleDay(index)}
                  className="h-5 w-5 text-brand-accent border-gray-300 rounded focus:ring-brand-accent"
                />
                <span className="ml-3 font-medium text-brand-primary">{weekDays[index]}</span>
              </label>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`start-time-${index}`} className="block text-sm font-medium text-gray-700">Início</label>
                <select
                  id={`start-time-${index}`}
                  value={day.startTime}
                  onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                  disabled={!day.enabled}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent disabled:bg-gray-100"
                >
                  {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor={`end-time-${index}`} className="block text-sm font-medium text-gray-700">Fim</label>
                <select
                  id={`end-time-${index}`}
                  value={day.endTime}
                  onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                  disabled={!day.enabled}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent disabled:bg-gray-100"
                >
                  {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-brand-accent rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
            {isLoading ? 'A guardar...' : 'Salvar Jornada de Trabalho'}
          </button>
        </div>
      </form>
    </div>
  );
}
import type { TUserStats, TWatchlistItem } from '@/api/types';

const MONTHS_IN_CHART = 12;
const SHORT_MONTHS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
] as const;

const PRIORITY_LABELS: Record<TWatchlistItem['priority'], string> = {
  high: 'Prioridade alta',
  medium: 'Prioridade média',
  low: 'Prioridade baixa',
};

export interface IMonthCount {
  month: string;
  label: string;
  count: number;
}

export function greetingFor(date: Date, name?: string): string {
  const hour = date.getHours();
  const greeting =
    hour >= 5 && hour < 12
      ? 'Bom dia'
      : hour >= 12 && hour < 18
        ? 'Boa tarde'
        : 'Boa noite';
  const firstName = name?.trim().split(/\s+/)[0];
  return firstName ? `${greeting}, ${firstName}` : greeting;
}

export function formatAverage(averageRating: number | null): string {
  return averageRating === null ? '–' : averageRating.toFixed(1);
}

export function formatHours(totalMinutes: number): string {
  return `${Math.round(totalMinutes / 60)}h`;
}

function monthKey(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

// The API only returns months with movies; the chart always shows the last 12.
export function lastTwelveMonths(
  moviesPerMonth: TUserStats['moviesPerMonth'],
  today: Date,
): IMonthCount[] {
  const counts = new Map(
    moviesPerMonth.map((item) => [item.month, item.count]),
  );
  return Array.from({ length: MONTHS_IN_CHART }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - (MONTHS_IN_CHART - 1 - index),
      1,
    );
    const month = monthKey(date.getFullYear(), date.getMonth());
    return {
      month,
      label: SHORT_MONTHS[date.getMonth()] ?? '',
      count: counts.get(month) ?? 0,
    };
  });
}

// plannedFor is a calendar date sent as midnight UTC, so its UTC parts are the day the user picked.
export function plannedLabel(plannedFor: string, today: Date): string {
  const planned = new Date(plannedFor);
  const plannedDay = Date.UTC(
    planned.getUTCFullYear(),
    planned.getUTCMonth(),
    planned.getUTCDate(),
  );
  const todayDay = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const days = Math.round((plannedDay - todayDay) / 86_400_000);
  if (days === 0) {
    return 'Hoje';
  }
  if (days === 1) {
    return 'Amanhã';
  }
  return `${planned.getUTCDate()} ${SHORT_MONTHS[planned.getUTCMonth()] ?? ''}`;
}

export function priorityLabel(priority: TWatchlistItem['priority']): string {
  return PRIORITY_LABELS[priority];
}

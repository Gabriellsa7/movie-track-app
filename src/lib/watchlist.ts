import type { IWatchlistItem } from '@/api/types';
import { SHORT_MONTHS } from '@/lib/stats';

type TPriority = IWatchlistItem['priority'];

const PRIORITY_LABELS: Record<TPriority, string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
};

export const PRIORITY_SHORT_LABELS: Record<TPriority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const PRIORITIES: TPriority[] = ['high', 'medium', 'low'];

const SHORT_WEEKDAYS = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
] as const;

const DAY_MILLISECONDS = 86_400_000;

function daysUntil(planned: Date, today: Date): number {
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
  return Math.round((plannedDay - todayDay) / DAY_MILLISECONDS);
}

export function isPlannedForToday(plannedFor: string, today: Date): boolean {
  return daysUntil(new Date(plannedFor), today) <= 0;
}

export function plannedLabel(
  plannedFor: string,
  today: Date,
  { withWeekday = false } = {},
): string {
  const planned = new Date(plannedFor);
  const days = daysUntil(planned, today);
  if (days === 0) {
    return 'Today';
  }
  if (days === 1) {
    return 'Tomorrow';
  }
  const date = `${SHORT_MONTHS[planned.getUTCMonth()] ?? ''} ${String(planned.getUTCDate())}`;
  return withWeekday
    ? `${SHORT_WEEKDAYS[planned.getUTCDay()] ?? ''}, ${date}`
    : date;
}

export function priorityLabel(priority: TPriority): string {
  return PRIORITY_LABELS[priority];
}

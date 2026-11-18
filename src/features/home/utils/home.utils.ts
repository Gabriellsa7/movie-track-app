import type { IWatchlistItem } from '@/api/types';
import { SHORT_MONTHS } from '@/lib/stats';

const PRIORITY_LABELS: Record<IWatchlistItem['priority'], string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
};

export function greetingFor(date: Date, name?: string): string {
  const hour = date.getHours();
  const greeting =
    hour >= 5 && hour < 12
      ? 'Good morning'
      : hour >= 12 && hour < 18
        ? 'Good afternoon'
        : 'Good evening';
  const firstName = name?.trim().split(/\s+/)[0];
  return firstName ? `${greeting}, ${firstName}` : greeting;
}

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
    return 'Today';
  }
  if (days === 1) {
    return 'Tomorrow';
  }
  return `${SHORT_MONTHS[planned.getUTCMonth()] ?? ''} ${planned.getUTCDate()}`;
}

export function priorityLabel(priority: IWatchlistItem['priority']): string {
  return PRIORITY_LABELS[priority];
}

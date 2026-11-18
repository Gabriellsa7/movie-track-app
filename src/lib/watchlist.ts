import type { IWatchlistItem } from '@/api/types';
import { tFor, type TLanguage } from '@/i18n';
import { formatDate } from '@/i18n/format';

type TPriority = IWatchlistItem['priority'];

export const PRIORITIES: TPriority[] = ['high', 'medium', 'low'];

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
  language: TLanguage,
  { withWeekday = false } = {},
): string {
  const planned = new Date(plannedFor);
  const days = daysUntil(planned, today);
  if (days === 0) {
    return tFor(language)('watchlist.today');
  }
  if (days === 1) {
    return tFor(language)('watchlist.tomorrow');
  }
  return formatDate(
    planned,
    {
      month: 'short',
      day: 'numeric',
      ...(withWeekday && { weekday: 'short' }),
    },
    language,
  );
}

export function priorityLabel(
  priority: TPriority,
  language: TLanguage,
): string {
  return tFor(language)(`watchlist.priority.${priority}`);
}

export function priorityShortLabel(
  priority: TPriority,
  language: TLanguage,
): string {
  return tFor(language)(`watchlist.priorityShort.${priority}`);
}

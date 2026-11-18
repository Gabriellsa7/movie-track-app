import type { IUserStats } from '@/api/types';
import { formatDecimal, formatShortMonth } from '@/i18n/format';
import type { TLanguage } from '@/i18n';

const MONTHS_IN_CHART = 12;

export interface IMonthCount {
  month: string;
  label: string;
  count: number;
}

export function formatAverage(
  averageRating: number | null,
  language: TLanguage,
): string {
  return averageRating === null
    ? '–'
    : formatDecimal(averageRating, 1, language);
}

export function formatHours(totalMinutes: number): string {
  return `${String(Math.round(totalMinutes / 60))}h`;
}

function monthKey(year: number, monthIndex: number): string {
  return `${String(year)}-${String(monthIndex + 1).padStart(2, '0')}`;
}

export function lastTwelveMonths(
  moviesPerMonth: IUserStats['moviesPerMonth'],
  today: Date,
  language: TLanguage,
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
      label: formatShortMonth(
        new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1)),
        language,
      ),
      count: counts.get(month) ?? 0,
    };
  });
}

import type { IUserStats } from '@/api/types';

const MONTHS_IN_CHART = 12;

export const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export interface IMonthCount {
  month: string;
  label: string;
  count: number;
}

export function formatAverage(averageRating: number | null): string {
  return averageRating === null ? '–' : averageRating.toFixed(1);
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

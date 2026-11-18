import type { IUserStats } from '@/api/types';
import type { IMonthCount } from '@/lib/stats';

export interface IMonthsInsights {
  thisMonth: number;
  bestMonth: IMonthCount | undefined;
  monthlyAverage: number;
}

export function monthsInsights(months: IMonthCount[]): IMonthsInsights {
  const total = months.reduce((sum, month) => sum + month.count, 0);
  const bestMonth = months.reduce<IMonthCount | undefined>(
    (best, month) =>
      month.count > 0 && month.count >= (best?.count ?? 0) ? month : best,
    undefined,
  );
  return {
    thisMonth: months.at(-1)?.count ?? 0,
    bestMonth,
    monthlyAverage: months.length
      ? Math.round((total / months.length) * 10) / 10
      : 0,
  };
}

export function mostGivenRating(
  distribution: IUserStats['ratingDistribution'],
): IUserStats['ratingDistribution'][number] | undefined {
  return distribution.reduce<
    IUserStats['ratingDistribution'][number] | undefined
  >(
    (most, entry) =>
      entry.count > 0 && entry.count > (most?.count ?? 0) ? entry : most,
    undefined,
  );
}

export function percentOf(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

export function rewatchCount(stats: IUserStats): number {
  return Math.max(0, stats.totalWatches - stats.totalMovies);
}

export function plural(
  count: number,
  singular: string,
  pluralWord: string,
): string {
  return `${String(count)} ${count === 1 ? singular : pluralWord}`;
}

import type { IUserStats } from '@/api/types';
import {
  monthsInsights,
  mostGivenRating,
  percentOf,
  rewatchCount,
} from './stats.utils';

const month = (label: string, count: number) => ({
  month: label,
  label,
  count,
});

describe('When we read the monthly numbers', () => {
  it('should find this month, the best month and the average', () => {
    const insights = monthsInsights([
      month('Oct', 4),
      month('Nov', 1),
      month('Dec', 4),
      month('Jan', 3),
    ]);

    expect(insights.thisMonth).toBe(3);
    expect(insights.bestMonth?.label).toBe('Dec');
    expect(insights.monthlyAverage).toBe(3);
  });

  it('should have no best month without movies', () => {
    expect(monthsInsights([month('Jan', 0)]).bestMonth).toBeUndefined();
    expect(monthsInsights([]).monthlyAverage).toBe(0);
  });
});

describe('When we read the ratings', () => {
  it('should find the rating given the most', () => {
    expect(
      mostGivenRating([
        { rating: 7, count: 2 },
        { rating: 8.5, count: 5 },
        { rating: 9, count: 5 },
      ]),
    ).toEqual({ rating: 8.5, count: 5 });
    expect(mostGivenRating([])).toBeUndefined();
  });
});

describe('When we compute shares and rewatches', () => {
  it('should round percentages and never divide by zero', () => {
    expect(percentOf(1, 3)).toBe(33);
    expect(percentOf(1, 0)).toBe(0);
  });

  it('should count the extra watches as rewatches', () => {
    expect(
      rewatchCount({ totalMovies: 10, totalWatches: 14 } as IUserStats),
    ).toBe(4);
  });
});

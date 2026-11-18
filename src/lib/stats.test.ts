import { formatAverage, formatHours, lastTwelveMonths } from './stats';

describe('When we format the stats', () => {
  it('should show a dash without an average', () => {
    expect(formatAverage(null)).toBe('–');
    expect(formatAverage(7)).toBe('7.0');
  });

  it('should round the minutes to hours', () => {
    expect(formatHours(14_790)).toBe('247h');
    expect(formatHours(0)).toBe('0h');
  });
});

describe('When we build the months chart', () => {
  it('should fill the last 12 months with 0, oldest first', () => {
    const months = lastTwelveMonths(
      [
        { month: '2025-12', count: 2 },
        { month: '2026-11', count: 5 },
        { month: '2024-01', count: 9 },
      ],
      new Date(2026, 10, 16),
    );

    expect(months).toHaveLength(12);
    expect(months[0]).toEqual({ month: '2025-12', label: 'Dec', count: 2 });
    expect(months[1]).toEqual({ month: '2026-01', label: 'Jan', count: 0 });
    expect(months[11]).toEqual({ month: '2026-11', label: 'Nov', count: 5 });
  });
});

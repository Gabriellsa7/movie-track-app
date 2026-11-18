import { isPlannedForToday, plannedLabel, priorityLabel } from './watchlist';

describe('When we describe the planned date', () => {
  const today = new Date(2026, 10, 16, 22);

  it('should say today and tomorrow', () => {
    expect(plannedLabel('2026-11-16T00:00:00.000Z', today)).toBe('Today');
    expect(plannedLabel('2026-11-17T00:00:00.000Z', today)).toBe('Tomorrow');
  });

  it('should show the day and month otherwise', () => {
    expect(plannedLabel('2026-12-03T00:00:00.000Z', today)).toBe('Dec 3');
  });

  it('should name the priority', () => {
    expect(priorityLabel('high')).toBe('High priority');
    expect(priorityLabel('low')).toBe('Low priority');
  });
});

describe('When we show the planned date on the watchlist', () => {
  const today = new Date(2026, 10, 16, 22);

  it('should add the weekday', () => {
    expect(
      plannedLabel('2026-11-21T00:00:00.000Z', today, { withWeekday: true }),
    ).toBe('Sat, Nov 21');
  });

  it('should treat today and past dates as due', () => {
    expect(isPlannedForToday('2026-11-16T00:00:00.000Z', today)).toBe(true);
    expect(isPlannedForToday('2026-11-10T00:00:00.000Z', today)).toBe(true);
    expect(isPlannedForToday('2026-11-17T00:00:00.000Z', today)).toBe(false);
  });
});

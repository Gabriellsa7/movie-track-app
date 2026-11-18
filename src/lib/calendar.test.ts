import {
  isOutsideRange,
  isSameDay,
  monthTitle,
  monthWeeks,
  shiftMonth,
} from './calendar';

describe('When we build a month for the calendar', () => {
  it('should start on the right weekday and fill whole weeks', () => {
    const weeks = monthWeeks({ year: 2026, month: 11 });

    expect(weeks).toHaveLength(5);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks[0]?.slice(0, 2)).toEqual([null, null]);
    expect(weeks[0]?.[2]?.getDate()).toBe(1);
    expect(weeks.flat().filter(Boolean)).toHaveLength(31);
  });

  it('should move across years and name the month', () => {
    expect(shiftMonth({ year: 2026, month: 11 }, 1)).toEqual({
      year: 2027,
      month: 0,
    });
    expect(monthTitle({ year: 2026, month: 10 })).toBe('November 2026');
  });
});

describe('When we compare calendar days', () => {
  it('should ignore the time of the day', () => {
    expect(
      isSameDay(new Date(2026, 10, 18, 9), new Date(2026, 10, 18, 22)),
    ).toBe(true);
  });

  it('should block the days outside the allowed range', () => {
    const today = new Date(2026, 10, 18, 15);

    expect(isOutsideRange(new Date(2026, 10, 17), today, undefined)).toBe(true);
    expect(isOutsideRange(new Date(2026, 10, 18), today, undefined)).toBe(
      false,
    );
    expect(isOutsideRange(new Date(2026, 10, 19), undefined, today)).toBe(true);
  });
});

const DAYS_IN_WEEK = 7;

export const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

export interface IMonth {
  year: number;
  month: number;
}

export function monthOf(date: Date): IMonth {
  return { year: date.getFullYear(), month: date.getMonth() };
}

export function shiftMonth({ year, month }: IMonth, offset: number): IMonth {
  return monthOf(new Date(year, month + offset, 1));
}

export function monthTitle({ year, month }: IMonth): string {
  return new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function monthWeeks({ year, month }: IMonth): (Date | null)[][] {
  const leadingBlanks = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => new Date(year, month, index + 1),
    ),
  ];
  while (cells.length % DAYS_IN_WEEK !== 0) {
    cells.push(null);
  }
  return Array.from({ length: cells.length / DAYS_IN_WEEK }, (_, week) =>
    cells.slice(week * DAYS_IN_WEEK, (week + 1) * DAYS_IN_WEEK),
  );
}

export function isSameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isOutsideRange(
  day: Date,
  minimumDate: Date | undefined,
  maximumDate: Date | undefined,
): boolean {
  return (
    (minimumDate !== undefined && day < startOfDay(minimumDate)) ||
    (maximumDate !== undefined && day > startOfDay(maximumDate))
  );
}

export function isMonthBefore(first: IMonth, second: IMonth): boolean {
  return first.year * 12 + first.month < second.year * 12 + second.month;
}

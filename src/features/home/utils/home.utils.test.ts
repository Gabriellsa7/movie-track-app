import {
  formatAverage,
  formatHours,
  greetingFor,
  lastTwelveMonths,
  plannedLabel,
  priorityLabel,
} from './home.utils';

const at = (hour: number) => new Date(2026, 10, 16, hour);

describe('When we greet the user', () => {
  it('should pick the greeting from the hour', () => {
    expect(greetingFor(at(4))).toBe('Boa noite');
    expect(greetingFor(at(5))).toBe('Bom dia');
    expect(greetingFor(at(12))).toBe('Boa tarde');
    expect(greetingFor(at(18))).toBe('Boa noite');
  });

  it('should use only the first name', () => {
    expect(greetingFor(at(9), ' Gabriel Santana ')).toBe('Bom dia, Gabriel');
  });
});

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
    expect(months[0]).toEqual({ month: '2025-12', label: 'dez', count: 2 });
    expect(months[1]).toEqual({ month: '2026-01', label: 'jan', count: 0 });
    expect(months[11]).toEqual({ month: '2026-11', label: 'nov', count: 5 });
  });
});

describe('When we describe the planned date', () => {
  const today = new Date(2026, 10, 16, 22);

  it('should say today and tomorrow', () => {
    expect(plannedLabel('2026-11-16T00:00:00.000Z', today)).toBe('Hoje');
    expect(plannedLabel('2026-11-17T00:00:00.000Z', today)).toBe('Amanhã');
  });

  it('should show the day and month otherwise', () => {
    expect(plannedLabel('2026-12-03T00:00:00.000Z', today)).toBe('3 dez');
  });

  it('should name the priority', () => {
    expect(priorityLabel('high')).toBe('Prioridade alta');
    expect(priorityLabel('low')).toBe('Prioridade baixa');
  });
});

import { greetingFor, plannedLabel, priorityLabel } from './home.utils';

const at = (hour: number) => new Date(2026, 10, 16, hour);

describe('When we greet the user', () => {
  it('should pick the greeting from the hour', () => {
    expect(greetingFor(at(4))).toBe('Good evening');
    expect(greetingFor(at(5))).toBe('Good morning');
    expect(greetingFor(at(12))).toBe('Good afternoon');
    expect(greetingFor(at(18))).toBe('Good evening');
  });

  it('should use only the first name', () => {
    expect(greetingFor(at(9), ' Gabriel Santana ')).toBe(
      'Good morning, Gabriel',
    );
  });
});

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

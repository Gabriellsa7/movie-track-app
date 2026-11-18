import { greetingFor } from './home.utils';

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

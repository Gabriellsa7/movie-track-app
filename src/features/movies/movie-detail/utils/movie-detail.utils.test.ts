import {
  formatRuntime,
  formatWatchCount,
  formatWatchedDate,
} from './movie-detail.utils';

describe('When we format the movie details', () => {
  it('should show the watched date as the day the user picked', () => {
    expect(formatWatchedDate('2026-10-12T00:00:00.000Z')).toBe('Oct 12, 2026');
  });

  it('should show the runtime in hours and minutes', () => {
    expect(formatRuntime(166)).toBe('2h 46m');
    expect(formatRuntime(120)).toBe('2h');
    expect(formatRuntime(45)).toBe('45m');
  });

  it('should show how many times it was watched', () => {
    expect(formatWatchCount(1)).toBe('Once');
    expect(formatWatchCount(3)).toBe('3 times');
  });
});

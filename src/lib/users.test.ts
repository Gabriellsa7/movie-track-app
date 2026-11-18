import {
  AVATAR_TONES,
  avatarToneOf,
  firstNameOf,
  formatMemberSince,
  formatMoviesCount,
  formatSince,
  initialsOf,
} from './users';

describe('When we show a user', () => {
  it('should use the first and last initials', () => {
    expect(initialsOf('Marina Costa')).toBe('MC');
    expect(initialsOf('  paulo henrique souza ')).toBe('PS');
    expect(initialsOf('Gabriel')).toBe('G');
  });

  it('should greet them by the first name', () => {
    expect(firstNameOf('Marina Costa')).toBe('Marina');
  });

  it('should always give the same user the same avatar tone', () => {
    expect(avatarToneOf('user-1')).toBe(avatarToneOf('user-1'));
    expect(AVATAR_TONES).toContain(avatarToneOf('another-user'));
  });

  it('should say since when they are a member', () => {
    expect(formatSince('2025-01-15T10:00:00.000Z')).toBe('Jan 2025');
    expect(formatMemberSince('2025-03-02T10:00:00.000Z')).toBe(
      'Member since March 2025',
    );
  });

  it('should count their movies', () => {
    expect(formatMoviesCount(1)).toBe('1 movie');
    expect(formatMoviesCount(214)).toBe('214 movies');
  });
});

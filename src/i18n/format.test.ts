import { formatWatchedDate } from '@/lib/movie-format';
import { formatRating } from '@/lib/rating';
import { formatAverage, lastTwelveMonths } from '@/lib/stats';
import { formatMemberSince, formatMoviesCount, formatSince } from '@/lib/users';
import { plannedLabel, priorityLabel } from '@/lib/watchlist';

describe('When the app is in Portuguese', () => {
  it('should write dates the Brazilian way', () => {
    expect(formatWatchedDate('2026-10-12T00:00:00.000Z', 'pt-BR')).toBe(
      '12 de out. de 2026',
    );
    expect(formatMemberSince('2025-03-02T10:00:00.000Z', 'pt-BR')).toBe(
      'Membro desde março de 2025',
    );
    expect(formatSince('2025-01-15T10:00:00.000Z', 'pt-BR')).toBe('Jan 2025');
  });

  it('should use a comma for decimals', () => {
    expect(formatRating(7.5, 'pt-BR')).toBe('7,5');
    expect(formatAverage(8, 'pt-BR')).toBe('8,0');
  });

  it('should translate counts, priorities and planned days', () => {
    const today = new Date(2026, 10, 16);

    expect(formatMoviesCount(1, 'pt-BR')).toBe('1 filme');
    expect(formatMoviesCount(214, 'pt-BR')).toBe('214 filmes');
    expect(priorityLabel('high', 'pt-BR')).toBe('Prioridade alta');
    expect(plannedLabel('2026-11-16T00:00:00.000Z', today, 'pt-BR')).toBe(
      'Hoje',
    );
    expect(plannedLabel('2026-11-17T00:00:00.000Z', today, 'pt-BR')).toBe(
      'Amanhã',
    );
  });

  it('should name the chart months in Portuguese', () => {
    const months = lastTwelveMonths([], new Date(2026, 10, 18), 'pt-BR');

    expect(months.at(-1)?.label).toBe('Nov');
    expect(months.at(-3)?.label).toBe('Set');
  });
});

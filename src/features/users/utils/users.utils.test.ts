import { A_MOVIE } from '@/test/fixtures';
import { sharedPosterUrl } from '@/lib/shared-poster';
import { toWatchlistItemBody } from './users.utils';

describe('When we copy a movie from someone else', () => {
  it('should keep the movie data and leave their review out', () => {
    expect(
      toWatchlistItemBody({
        ...A_MOVIE,
        tmdbId: 693134,
        director: 'Denis Villeneuve',
        durationMinutes: 166,
        review: 'Their review',
        posterUrl: 'https://image.tmdb.org/t/p/w500/dune.jpg',
      }),
    ).toEqual({
      title: 'Duna: Parte 2',
      releaseYear: 2024,
      synopsis: 'Paul Atreides se une aos Fremen.',
      genreIds: ['genre-1'],
      tmdbId: 693134,
      director: 'Denis Villeneuve',
      durationMinutes: 166,
      posterUrl: 'https://image.tmdb.org/t/p/w500/dune.jpg',
    });
  });

  it('should only reuse TMDB posters, not files the other user uploaded', () => {
    expect(
      sharedPosterUrl('https://res.cloudinary.com/x/posters/a.png'),
    ).toBeUndefined();
    expect(sharedPosterUrl(undefined)).toBeUndefined();
  });
});

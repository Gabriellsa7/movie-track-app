import type { IMovie, INewWatchlistItemBody } from '@/api/types';
import { sharedPosterUrl } from '@/lib/shared-poster';

export function toWatchlistItemBody(movie: IMovie): INewWatchlistItemBody {
  const posterUrl = sharedPosterUrl(movie.posterUrl);
  return {
    title: movie.title,
    releaseYear: movie.releaseYear,
    synopsis: movie.synopsis,
    genreIds: movie.genreIds,
    ...(movie.tmdbId !== undefined && { tmdbId: movie.tmdbId }),
    ...(movie.director && { director: movie.director }),
    ...(movie.durationMinutes !== undefined && {
      durationMinutes: movie.durationMinutes,
    }),
    ...(posterUrl && { posterUrl }),
  };
}

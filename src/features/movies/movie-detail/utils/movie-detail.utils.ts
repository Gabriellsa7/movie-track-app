import type { IMovie } from '@/api/types';
import { tFor, type TLanguage } from '@/i18n';

export function formatWatchCount(
  watchCount: number,
  language: TLanguage,
): string {
  return watchCount === 1
    ? tFor(language)('movies.detail.watchedOnce')
    : tFor(language)('movies.detail.watchedTimes', { count: watchCount });
}

export function reviewShare(
  movie: Pick<IMovie, 'id' | 'title' | 'userId'>,
  language: TLanguage,
): {
  message: string;
  path: string;
} {
  return {
    message: tFor(language)('movies.detail.shareMessage', {
      title: movie.title,
    }),
    path: `/users/${movie.userId}/movies/${movie.id}`,
  };
}

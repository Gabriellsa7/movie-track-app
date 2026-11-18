import type { IMovie } from '@/api/types';

export function formatWatchCount(watchCount: number): string {
  return watchCount === 1
    ? 'Watched once'
    : `Watched ${String(watchCount)} times`;
}

export function reviewShare(movie: Pick<IMovie, 'id' | 'title' | 'userId'>): {
  message: string;
  path: string;
} {
  return {
    message: `My review of ${movie.title} on Movie Track:`,
    path: `/users/${movie.userId}/movies/${movie.id}`,
  };
}

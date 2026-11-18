const TMDB_POSTER_HOST = 'https://image.tmdb.org/';

export function sharedPosterUrl(posterUrl: string | undefined) {
  return posterUrl?.startsWith(TMDB_POSTER_HOST) ? posterUrl : undefined;
}

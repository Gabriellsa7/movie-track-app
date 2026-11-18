import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { toast } from 'sonner-native';
import type { IMovie } from '@/api/types';
import { goBackOr } from '@/lib/navigation';
import { shareLink } from '@/lib/share';
import { ROUTES } from '@/routes/routes.constants';
import { useDeleteMovieMutation } from '../../api/delete-movie';
import { useSetFavoriteMutation } from '../../api/patch-movie-favorite';
import { useRewatchMovieMutation } from '../../api/post-movie-rewatch';
import { reviewShare } from '../utils/movie-detail.utils';
import { i18n, useLanguage } from '@/i18n';

export function useMovieDetailActions(
  movieId: string,
  movie: IMovie | undefined,
) {
  const language = useLanguage();
  const setFavorite = useSetFavoriteMutation(movieId);
  const rewatch = useRewatchMovieMutation(movieId);
  const deleteMovie = useDeleteMovieMutation();

  function toggleFavorite() {
    if (movie) {
      setFavorite.mutate(!movie.isFavorite);
    }
  }

  function watchedAgain() {
    rewatch.mutate(undefined, {
      onSuccess: () => {
        toast.success(i18n.t('movies.detail.rewatched'));
      },
      onError: () => {
        toast.error(i18n.t('movies.detail.rewatchFailed'));
      },
    });
  }

  function share() {
    if (movie) {
      const { message, path } = reviewShare(movie, language);
      void shareLink(message, Linking.createURL(path));
    }
  }

  function edit() {
    router.push({ pathname: '/movies/[movieId]/edit', params: { movieId } });
  }

  function remove() {
    deleteMovie.mutate(movieId, {
      onSuccess: () => {
        toast.success(i18n.t('movies.detail.deleted'));
        goBackOr(ROUTES.movies);
      },
      onError: () => {
        toast.error(i18n.t('movies.detail.deleteFailed'));
      },
    });
  }

  return {
    toggleFavorite,
    watchedAgain,
    share,
    edit,
    remove,
    isRewatching: rewatch.isPending,
  };
}

import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import type { IMovie } from '@/api/types';
import { useAddWatchlistItemMutation } from '@/features/watchlist/api/post-watchlist-item';
import { notifySaveError } from '@/lib/forms/notify-save-error';
import { shareLink } from '@/lib/share';
import { toWatchlistItemBody } from '../../utils/users.utils';
import { i18n } from '@/i18n';
import { translateMessage } from '@/i18n/message';

const ADD_ERRORS: Partial<Record<string, string>> = {
  [EApiErrorCode.ALREADY_IN_WATCHLIST]: 'users.review.alreadyInWatchlist',
  [EApiErrorCode.MOVIE_ALREADY_LOGGED]: 'users.review.alreadyLogged',
};

export function useReviewActions(movie: IMovie | undefined, authorName = '') {
  const addItem = useAddWatchlistItemMutation();

  function wantToWatch() {
    if (!movie) {
      return;
    }
    addItem.mutate(toWatchlistItemBody(movie), {
      onSuccess: () => {
        toast.success(i18n.t('users.review.added'));
      },
      onError: (error) => {
        const message = ADD_ERRORS[ApiError.from(error).code];
        if (message) {
          toast.error(translateMessage(message));
          return;
        }
        notifySaveError(error, 'users.review.addFailed');
      },
    });
  }

  function alreadyWatched() {
    if (movie) {
      router.push({
        pathname: '/movies/new',
        params: { fromUserId: movie.userId, fromMovieId: movie.id },
      });
    }
  }

  function share() {
    if (movie) {
      void shareLink(
        i18n.t('users.review.shareMessage', {
          name: authorName,
          title: movie.title,
        }),
        Linking.createURL(`/users/${movie.userId}/movies/${movie.id}`),
      );
    }
  }

  return {
    wantToWatch,
    alreadyWatched,
    share,
    isAdding: addItem.isPending,
  };
}

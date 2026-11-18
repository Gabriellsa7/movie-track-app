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

const ADD_ERRORS: Partial<Record<string, string>> = {
  [EApiErrorCode.ALREADY_IN_WATCHLIST]: 'It is already on your watchlist.',
  [EApiErrorCode.MOVIE_ALREADY_LOGGED]: "You've already logged this movie.",
};

export function useReviewActions(movie: IMovie | undefined, authorName = '') {
  const addItem = useAddWatchlistItemMutation();

  function wantToWatch() {
    if (!movie) {
      return;
    }
    addItem.mutate(toWatchlistItemBody(movie), {
      onSuccess: () => {
        toast.success('Added to your watchlist');
      },
      onError: (error) => {
        const message = ADD_ERRORS[ApiError.from(error).code];
        if (message) {
          toast.error(message);
          return;
        }
        notifySaveError(error, "Couldn't add it to your watchlist. Try again.");
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
        `${authorName}'s review of ${movie.title} on Movie Track:`,
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

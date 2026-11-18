import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';
import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { useGenresQuery } from '@/api/get-genres';
import { SectionError } from '@/components/section-error';
import { shareLink } from '@/lib/share';
import { useDeleteMovieMutation } from '../api/delete-movie';
import { useMovieQuery } from '../api/get-movie';
import { useSetFavoriteMutation } from '../api/patch-movie-favorite';
import { useRewatchMovieMutation } from '../api/post-movie-rewatch';
import { MovieActions } from './components/movie-actions/movie-actions';
import {
  goBackToMovies,
  MovieDetailHero,
} from './components/movie-detail-hero/movie-detail-hero';
import { MovieDetailSkeleton } from './components/movie-detail-skeleton/movie-detail-skeleton';
import { MovieInfoSection } from './components/movie-info-section/movie-info-section';
import { MovieRatingCard } from './components/movie-rating-card/movie-rating-card';
import {
  formatWatchCount,
  formatWatchedDate,
} from './utils/movie-detail.utils';

export function MovieDetailScreen() {
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  const movie = useMovieQuery(movieId);
  const genres = useGenresQuery();
  const setFavorite = useSetFavoriteMutation(movieId);
  const rewatch = useRewatchMovieMutation(movieId);
  const deleteMovie = useDeleteMovieMutation();

  const genreNames =
    movie.data?.genreIds
      .map(
        (genreId) => genres.data?.find((genre) => genre.id === genreId)?.name,
      )
      .filter((name): name is string => Boolean(name)) ?? [];

  function toggleFavorite() {
    if (movie.data) {
      setFavorite.mutate(!movie.data.isFavorite);
    }
  }

  function watchedAgain() {
    rewatch.mutate(undefined, {
      onSuccess: () => {
        toast.success('Added one more watch');
      },
      onError: () => {
        toast.error("Couldn't save the new watch. Try again.");
      },
    });
  }

  function share() {
    if (!movie.data) {
      return;
    }
    const { title, userId, id } = movie.data;
    void shareLink(
      `My review of ${title} on Movie Track:`,
      Linking.createURL(`/users/${userId}/movies/${id}`),
    );
  }

  function remove() {
    deleteMovie.mutate(movieId, {
      onSuccess: () => {
        toast.success('Movie deleted');
        goBackToMovies();
      },
      onError: () => {
        toast.error("Couldn't delete the movie. Try again.");
      },
    });
  }

  function showMoreOptions() {
    Alert.alert(movie.data?.title ?? 'Movie', undefined, [
      {
        text: 'Delete movie',
        style: 'destructive',
        onPress: () => {
          Alert.alert(
            'Delete movie?',
            `"${movie.data?.title ?? ''}" will be removed from your movies.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: remove },
            ],
          );
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function renderBody() {
    if (movie.isPending) {
      return <MovieDetailSkeleton />;
    }
    if (movie.isError) {
      return ApiError.from(movie.error).is(EApiErrorCode.MOVIE_NOT_FOUND) ? (
        <Text className="font-sans text-base text-secondary-text-color">
          This movie no longer exists.
        </Text>
      ) : (
        <SectionError
          message="Couldn't load this movie."
          onRetry={() => void movie.refetch()}
        />
      );
    }

    const { data } = movie;
    return (
      <View className="gap-4">
        {genreNames.length > 0 && (
          <View className="flex-row flex-wrap gap-1.5">
            {genreNames.map((name) => (
              <View
                key={name}
                className="h-[26px] justify-center rounded-full bg-tertiary-bg-color px-2.5"
              >
                <Text className="font-sans text-xs text-primary-text-color">
                  {name}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View className="gap-2.5">
          <MovieRatingCard rating={data.rating} />
          <Text className="font-sans text-[13px] text-tertiary-text-color">
            <Text className="font-semibold text-primary-text-color">
              {formatWatchCount(data.watchCount)}
            </Text>
            {` · last on ${formatWatchedDate(data.watchedAt)}`}
          </Text>
        </View>

        <MovieActions
          isFavorite={data.isFavorite}
          isRewatching={rewatch.isPending}
          onToggleFavorite={toggleFavorite}
          onRewatch={watchedAgain}
          onShare={share}
        />

        {data.review && (
          <MovieInfoSection title="My review" card>
            <Text className="font-sans text-[15px] leading-6 text-primary-text-color">
              {data.review}
            </Text>
          </MovieInfoSection>
        )}

        <MovieInfoSection title="Synopsis">
          <Text className="font-sans text-sm leading-[22px] text-secondary-text-color">
            {data.synopsis}
          </Text>
        </MovieInfoSection>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary-bg-color">
      <ScrollView contentContainerClassName="pb-10">
        <MovieDetailHero
          movie={movie.data}
          onMoreOptions={movie.data ? showMoreOptions : undefined}
        />
        <View className="px-5 pt-[18px]">{renderBody()}</View>
      </ScrollView>
    </View>
  );
}

import { useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { useGenresQuery } from '@/api/get-genres';
import { SectionError } from '@/components/section-error';
import { useDeleteMovieMutation } from '../api/delete-movie';
import { useMovieQuery } from '../api/get-movie';
import { useSetFavoriteMutation } from '../api/patch-movie-favorite';
import {
  goBackToMovies,
  MovieDetailHeader,
} from './components/movie-detail-header/movie-detail-header';
import { MovieDetailSkeleton } from './components/movie-detail-skeleton/movie-detail-skeleton';
import { MovieHero } from './components/movie-hero/movie-hero';
import { MovieInfoSection } from './components/movie-info-section/movie-info-section';
import {
  formatWatchCount,
  formatWatchedDate,
} from './utils/movie-detail.utils';

export function MovieDetailScreen() {
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  const movie = useMovieQuery(movieId);
  const genres = useGenresQuery();
  const setFavorite = useSetFavoriteMutation(movieId);
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

  function confirmDelete() {
    Alert.alert(
      'Delete movie?',
      `"${movie.data?.title ?? ''}" will be removed from your movies.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteMovie.mutate(movieId, {
              onSuccess: () => {
                toast.success('Movie deleted');
                goBackToMovies();
              },
              onError: () => {
                toast.error("Couldn't delete the movie. Try again.");
              },
            });
          },
        },
      ],
    );
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
      <View className="gap-6">
        <MovieHero movie={data} genreNames={genreNames} />
        <View className="flex-row gap-3">
          <View className="flex-1 gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-3.5">
            <Text className="font-sans text-xs text-tertiary-text-color">
              Watched on
            </Text>
            <Text className="font-semibold text-sm text-primary-text-color">
              {formatWatchedDate(data.watchedAt)}
            </Text>
          </View>
          <View className="flex-1 gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-3.5">
            <Text className="font-sans text-xs text-tertiary-text-color">
              Watched
            </Text>
            <Text className="font-semibold text-sm text-primary-text-color">
              {formatWatchCount(data.watchCount)}
            </Text>
          </View>
        </View>
        <MovieInfoSection title="Synopsis">
          <Text className="font-sans text-base leading-6 text-secondary-text-color">
            {data.synopsis}
          </Text>
        </MovieInfoSection>
        {data.review && (
          <MovieInfoSection title="Your review">
            <Text className="font-sans text-base leading-6 text-secondary-text-color">
              {data.review}
            </Text>
          </MovieInfoSection>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color" edges={['top']}>
      <ScrollView contentContainerClassName="gap-4 px-5 pb-10 pt-2">
        <MovieDetailHeader
          isFavorite={movie.data?.isFavorite}
          onToggleFavorite={movie.data ? toggleFavorite : undefined}
          onDelete={movie.data ? confirmDelete : undefined}
        />
        {renderBody()}
      </ScrollView>
    </SafeAreaView>
  );
}

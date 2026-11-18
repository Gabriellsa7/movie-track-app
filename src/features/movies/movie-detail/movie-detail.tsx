import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { useGenreNames } from '@/api/get-genres';
import { ActionSheet } from '@/components/action-sheet';
import { SectionError } from '@/components/section-error';
import { useLocalSearchParams } from 'expo-router';
import { Pencil, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useMovieQuery } from '../api/get-movie';
import { MovieActions } from './components/movie-actions/movie-actions';
import { MovieDetailHero } from './components/movie-detail-hero/movie-detail-hero';
import { MovieDetailSkeleton } from './components/movie-detail-skeleton/movie-detail-skeleton';
import { MovieGenreChips } from './components/movie-genre-chips/movie-genre-chips';
import { MovieInfoSection } from './components/movie-info-section/movie-info-section';
import { MovieRatingCard } from './components/movie-rating-card/movie-rating-card';
import { useMovieDetailActions } from './hooks/use-movie-detail-actions';
import {
  formatWatchCount,
  formatWatchedDate,
} from './utils/movie-detail.utils';

type TSheet = 'options' | 'confirmDelete' | null;

export function MovieDetailScreen() {
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  const movie = useMovieQuery(movieId);
  const genreNames = useGenreNames(movie.data?.genreIds);
  const actions = useMovieDetailActions(movieId, movie.data);
  const [sheet, setSheet] = useState<TSheet>(null);
  const title = movie.data?.title ?? '';

  function closeSheet() {
    setSheet(null);
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
        <MovieGenreChips names={genreNames} />

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
          isRewatching={actions.isRewatching}
          onToggleFavorite={actions.toggleFavorite}
          onRewatch={actions.watchedAgain}
          onShare={actions.share}
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
          onMoreOptions={
            movie.data
              ? () => {
                  setSheet('options');
                }
              : undefined
          }
        />
        <View className="px-5 pt-[18px]">{renderBody()}</View>
      </ScrollView>

      <ActionSheet
        title={title}
        visible={sheet === 'options'}
        onClose={closeSheet}
        actions={[
          {
            label: 'Edit movie',
            icon: Pencil,
            onPress: actions.edit,
          },
          {
            label: 'Delete movie',
            icon: Trash2,
            destructive: true,
            onPress: () => {
              setSheet('confirmDelete');
            },
          },
        ]}
      />
      <ActionSheet
        title="Delete movie?"
        message={`"${title}" will be removed from your movies.`}
        visible={sheet === 'confirmDelete'}
        onClose={closeSheet}
        actions={[
          {
            label: 'Delete',
            icon: Trash2,
            destructive: true,
            onPress: actions.remove,
          },
        ]}
      />
    </View>
  );
}

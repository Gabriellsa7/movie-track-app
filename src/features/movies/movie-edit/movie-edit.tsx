import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { SectionError } from '@/components/section-error';
import { Skeleton } from '@/components/skeleton';
import { useMovieQuery } from '../api/get-movie';
import { MovieEditor } from '../movie-form/components/movie-editor/movie-editor';
import { useTranslation } from 'react-i18next';

export function MovieEditScreen() {
  const { t } = useTranslation();
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  const movie = useMovieQuery(movieId);

  function renderFallback() {
    if (movie.isPending) {
      return <Skeleton className="h-40 rounded-xl" />;
    }
    return ApiError.from(movie.error).is(EApiErrorCode.MOVIE_NOT_FOUND) ? (
      <Text className="font-sans text-base text-secondary-text-color">
        {t('movies.detail.notFound')}
      </Text>
    ) : (
      <SectionError
        message={t('movies.detail.loadFailed')}
        onRetry={() => void movie.refetch()}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {movie.data ? (
          <MovieEditor movie={movie.data} />
        ) : (
          <View className="gap-4 px-5 pt-4">{renderFallback()}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { MovieRatingCard } from '@/components/movie-rating-card';
import { SectionError } from '@/components/section-error';
import { Skeleton } from '@/components/skeleton';
import { firstNameOf } from '@/lib/users';
import { useSessionStore } from '@/stores/session.store';
import { useUserMovieQuery } from '../api/get-user-movie';
import { useUserProfileQuery } from '../api/get-user-profile';
import { ProfileTopBar } from '../components/profile-top-bar/profile-top-bar';
import { ReviewAuthor } from './components/review-author/review-author';
import { ReviewCta } from './components/review-cta/review-cta';
import { ReviewMovie } from './components/review-movie/review-movie';
import { useReviewActions } from './hooks/use-review-actions';
import { useTranslation } from 'react-i18next';

export function UserReviewScreen() {
  const { t } = useTranslation();
  const { userId, movieId } = useLocalSearchParams<{
    userId: string;
    movieId: string;
  }>();
  const myUserId = useSessionStore((state) => state.userId);
  const author = useUserProfileQuery(userId);
  const movie = useUserMovieQuery(userId, movieId);
  const actions = useReviewActions(movie.data, author.data?.name);
  const isMine = userId === myUserId;

  function renderBody() {
    if (movie.isPending) {
      return (
        <View className="gap-[18px]">
          <Skeleton className="h-11 w-48 rounded-full" />
          <Skeleton className="h-[165px] rounded-[10px]" />
          <Skeleton className="h-[64px] rounded-[14px]" />
        </View>
      );
    }
    if (movie.isError) {
      return ApiError.from(movie.error).is(EApiErrorCode.MOVIE_NOT_FOUND) ? (
        <Text className="font-sans text-base text-secondary-text-color">
          {t('users.review.notFound')}
        </Text>
      ) : (
        <SectionError
          message={t('users.review.loadFailed')}
          onRetry={() => void movie.refetch()}
        />
      );
    }

    const { data } = movie;
    return (
      <View className="flex-1 gap-[18px]">
        {author.data && (
          <ReviewAuthor author={author.data} watchedAt={data.watchedAt} />
        )}
        <ReviewMovie movie={data} />
        <MovieRatingCard rating={data.rating} />
        {data.review ? (
          <View className="gap-2">
            <Text className="font-semibold text-xs uppercase tracking-[1px] text-tertiary-text-color">
              {author.data
                ? t('users.review.authorReview', {
                    name: firstNameOf(author.data.name),
                  })
                : t('users.review.review')}
            </Text>
            <Text className="font-sans text-base leading-[26px] text-primary-text-color">
              {data.review}
            </Text>
          </View>
        ) : null}
        {!isMine && (
          <View className="mt-auto">
            <ReviewCta
              isAdding={actions.isAdding}
              onWantToWatch={actions.wantToWatch}
              onAlreadyWatched={actions.alreadyWatched}
            />
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color" edges={['top']}>
      <ScrollView contentContainerClassName="flex-grow gap-[18px] px-5 pb-6 pt-1">
        <ProfileTopBar
          backLabel={t('users.review.back')}
          backTo={{ pathname: '/users/[userId]', params: { userId } }}
          shareLabel={t('users.review.share')}
          onShare={movie.data ? actions.share : undefined}
        />
        {renderBody()}
      </ScrollView>
    </SafeAreaView>
  );
}

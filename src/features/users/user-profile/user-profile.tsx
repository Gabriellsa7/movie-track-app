import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError } from '@/api/api-error';
import { pagesItems } from '@/api/pagination';
import { EApiErrorCode } from '@/api/error-codes';
import { FilterChip } from '@/components/filter-chip';
import { OptionSheet } from '@/components/option-sheet';
import { SectionError } from '@/components/section-error';
import {
  movieSortOptions,
  movieSortLabel,
  movieSortQuery,
  type TMovieSortKey,
} from '@/lib/movie-sort';
import { shareLink } from '@/lib/share';
import { useLoadMore } from '@/lib/use-load-more';
import { useRefreshControl } from '@/lib/use-refresh-control';
import { ROUTES } from '@/routes/routes.constants';
import { useUserMoviePagesQuery } from '../api/get-user-movies';
import { useUserProfileQuery } from '../api/get-user-profile';
import { ProfileHeader } from './components/profile-header/profile-header';
import { ProfileMovieRow } from './components/profile-movie-row/profile-movie-row';
import { ProfileMoviesSkeleton } from './components/profile-movies-skeleton/profile-movies-skeleton';
import { ProfileSkeleton } from './components/profile-skeleton/profile-skeleton';
import { ProfileStats } from './components/profile-stats/profile-stats';
import { ProfileTopBar } from '../components/profile-top-bar/profile-top-bar';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n';

export function UserProfileScreen() {
  const { t } = useTranslation();
  const language = useLanguage();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [sort, setSort] = useState<TMovieSortKey>('rating');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const profile = useUserProfileQuery(userId);
  const movies = useUserMoviePagesQuery(userId, movieSortQuery(sort));
  const loadMore = useLoadMore(movies);
  const refreshControl = useRefreshControl(() =>
    Promise.all([profile.refetch(), movies.refetch()]),
  );
  const user = profile.data;

  function share() {
    if (user) {
      void shareLink(
        t('users.profile.shareMessage', { name: user.name }),
        Linking.createURL(`/users/${user.id}`),
      );
    }
  }

  function renderProfile() {
    if (user) {
      return (
        <View className="gap-[18px]">
          <ProfileHeader user={user} />
          <ProfileStats user={user} />
          <View className="flex-row items-center justify-between">
            <Text className="font-semibold text-base text-primary-text-color">
              {t('users.profile.movies')}
            </Text>
            <FilterChip
              label={movieSortLabel(sort, language)}
              active={false}
              withMenu
              onPress={() => {
                setIsSortOpen(true);
              }}
            />
          </View>
        </View>
      );
    }
    if (profile.isPending) {
      return <ProfileSkeleton />;
    }
    return ApiError.from(profile.error).is(EApiErrorCode.USER_NOT_FOUND) ? (
      <Text className="font-sans text-base text-secondary-text-color">
        {t('users.profile.notFound')}
      </Text>
    ) : (
      <SectionError
        message={t('users.profile.loadFailed')}
        onRetry={() => void profile.refetch()}
      />
    );
  }

  function renderEmptyMovies() {
    if (!user) {
      return undefined;
    }
    if (movies.isPending) {
      return <ProfileMoviesSkeleton />;
    }
    if (movies.isError) {
      return (
        <SectionError
          message={t('users.profile.moviesLoadFailed')}
          onRetry={() => void movies.refetch()}
        />
      );
    }
    return (
      <Text className="font-sans text-sm text-tertiary-text-color">
        {t('users.profile.noMovies')}
      </Text>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color" edges={['top']}>
      <FlatList
        data={user ? pagesItems(movies.data) : undefined}
        keyExtractor={(movie) => movie.id}
        renderItem={({ item }) => <ProfileMovieRow movie={item} />}
        ItemSeparatorComponent={() => <View className="h-2.5" />}
        ListHeaderComponent={
          <View className="gap-[18px] pb-[18px]">
            <ProfileTopBar
              backLabel={t('users.profile.back')}
              backTo={ROUTES.users}
              shareLabel={t('users.profile.share')}
              onShare={user ? share : undefined}
            />
            {renderProfile()}
          </View>
        }
        ListEmptyComponent={renderEmptyMovies()}
        contentContainerClassName="px-5 pb-10 pt-1"
        refreshControl={refreshControl}
        {...loadMore}
      />
      <OptionSheet<TMovieSortKey>
        title={t('users.profile.sortTitle')}
        visible={isSortOpen}
        options={movieSortOptions(language)}
        selected={sort}
        onSelect={setSort}
        onClose={() => {
          setIsSortOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

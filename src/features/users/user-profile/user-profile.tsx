import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { FilterChip } from '@/components/filter-chip';
import { OptionSheet } from '@/components/option-sheet';
import { SectionError } from '@/components/section-error';
import {
  MOVIE_SORT_OPTIONS,
  movieSortLabel,
  movieSortQuery,
  type TMovieSortKey,
} from '@/lib/movie-sort';
import { shareLink } from '@/lib/share';
import { useRefreshControl } from '@/lib/use-refresh-control';
import { ROUTES } from '@/routes/routes.constants';
import { useUserMoviesQuery } from '../api/get-user-movies';
import { useUserProfileQuery } from '../api/get-user-profile';
import { ProfileHeader } from './components/profile-header/profile-header';
import { ProfileMovieRow } from './components/profile-movie-row/profile-movie-row';
import { ProfileMoviesSkeleton } from './components/profile-movies-skeleton/profile-movies-skeleton';
import { ProfileSkeleton } from './components/profile-skeleton/profile-skeleton';
import { ProfileStats } from './components/profile-stats/profile-stats';
import { ProfileTopBar } from '../components/profile-top-bar/profile-top-bar';

const MOVIES_PER_PAGE = 50;

export function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [sort, setSort] = useState<TMovieSortKey>('rating');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const profile = useUserProfileQuery(userId);
  const movies = useUserMoviesQuery(userId, {
    ...movieSortQuery(sort),
    limit: MOVIES_PER_PAGE,
  });
  const refreshControl = useRefreshControl(() =>
    Promise.all([profile.refetch(), movies.refetch()]),
  );
  const user = profile.data;

  function share() {
    if (user) {
      void shareLink(
        `${user.name}'s movies on Movie Track:`,
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
              Movies
            </Text>
            <FilterChip
              label={movieSortLabel(sort)}
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
        This user no longer exists.
      </Text>
    ) : (
      <SectionError
        message="Couldn't load this profile."
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
          message="Couldn't load their movies."
          onRetry={() => void movies.refetch()}
        />
      );
    }
    return (
      <Text className="font-sans text-sm text-tertiary-text-color">
        No movies logged yet.
      </Text>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color" edges={['top']}>
      <FlatList
        data={user ? movies.data?.items : undefined}
        keyExtractor={(movie) => movie.id}
        renderItem={({ item }) => <ProfileMovieRow movie={item} />}
        ItemSeparatorComponent={() => <View className="h-2.5" />}
        ListHeaderComponent={
          <View className="gap-[18px] pb-[18px]">
            <ProfileTopBar
              backLabel="Back"
              backTo={ROUTES.users}
              shareLabel="Share profile"
              onShare={user ? share : undefined}
            />
            {renderProfile()}
          </View>
        }
        ListEmptyComponent={renderEmptyMovies()}
        contentContainerClassName="px-5 pb-10 pt-1"
        refreshControl={refreshControl}
      />
      <OptionSheet<TMovieSortKey>
        title="Sort movies"
        visible={isSortOpen}
        options={MOVIE_SORT_OPTIONS}
        selected={sort}
        onSelect={setSort}
        onClose={() => {
          setIsSortOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

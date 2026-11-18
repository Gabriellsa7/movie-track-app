import { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMoviesQuery } from '@/api/get-movies';
import type { IListMoviesQuery } from '@/api/types';
import { NewMovieButton } from '@/components/new-movie-button';
import { SectionError } from '@/components/section-error';
import { useDebouncedValue } from '@/lib/use-debounced-value';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { MovieCard } from './components/movie-card/movie-card';
import { MovieCardSkeleton } from './components/movie-card-skeleton/movie-card-skeleton';
import { MovieSearch } from './components/movie-search/movie-search';
import { MoviesEmpty } from './components/movies-empty/movies-empty';
import { MoviesHeader } from './components/movies-header/movies-header';

export const MOVIES_DEFAULT_QUERY: IListMoviesQuery = {
  sort: 'watchedAt',
  order: 'desc',
};
const SEARCH_DEBOUNCE_MILLISECONDS = 300;
const SKELETON_ROWS = [0, 1, 2, 3];

export function MoviesScreen() {
  const scheme = useAppTheme();
  const [searchText, setSearchText] = useState('');
  const search = useDebouncedValue(
    searchText.trim(),
    SEARCH_DEBOUNCE_MILLISECONDS,
  );
  const query: IListMoviesQuery = {
    ...MOVIES_DEFAULT_QUERY,
    ...(search && { search }),
  };
  const { data: page, isPending, isError, refetch } = useMoviesQuery(query);
  // Local, so only the pull gesture shows the spinner (not a new search keeping the old page).
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  function renderEmpty() {
    if (isPending) {
      return (
        <View className="gap-3">
          {SKELETON_ROWS.map((row) => (
            <MovieCardSkeleton key={row} />
          ))}
        </View>
      );
    }
    if (isError) {
      return (
        <SectionError
          message="Não foi possível carregar seus filmes."
          onRetry={() => void refetch()}
        />
      );
    }
    return <MoviesEmpty search={search} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color" edges={['top']}>
      <FlatList
        data={page?.items}
        keyExtractor={(movie) => movie.id}
        renderItem={({ item }) => <MovieCard movie={item} />}
        ListHeaderComponent={
          <View className="gap-4 pb-4">
            <MoviesHeader total={page?.total} />
            <MovieSearch value={searchText} onChangeText={setSearchText} />
          </View>
        }
        ListEmptyComponent={renderEmpty()}
        ItemSeparatorComponent={() => <View className="h-3" />}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerClassName="px-5 pb-28 pt-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refresh()}
            tintColor={color(scheme, 'accent-bg-color')}
            colors={[color(scheme, 'accent-bg-color')]}
          />
        }
      />
      <NewMovieButton />
    </SafeAreaView>
  );
}

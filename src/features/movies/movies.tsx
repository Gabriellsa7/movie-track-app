import { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMoviesQuery } from '@/api/get-movies';
import { NewMovieButton } from '@/components/new-movie-button';
import { SectionError } from '@/components/section-error';
import { useDebouncedValue } from '@/lib/use-debounced-value';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { MovieCard } from './components/movie-card/movie-card';
import { MovieCardSkeleton } from './components/movie-card-skeleton/movie-card-skeleton';
import { MovieFilters } from './components/movie-filters/movie-filters';
import { MovieSearch } from './components/movie-search/movie-search';
import { MoviesEmpty } from './components/movies-empty/movies-empty';
import { MoviesHeader } from './components/movies-header/movies-header';
import {
  hasActiveFilters,
  MOVIE_DEFAULT_FILTERS,
  toMoviesQuery,
  type IMovieFilters,
} from './constants/constants';

const SEARCH_DEBOUNCE_MILLISECONDS = 300;
const COLUMNS = 3;
const SCREEN_PADDING = 20;
const COLUMN_GAP = 10;
const SKELETON_TILES = [0, 1, 2, 3, 4, 5];

export function MoviesScreen() {
  const scheme = useAppTheme();
  const { width: screenWidth } = useWindowDimensions();
  const tileWidth =
    (screenWidth - SCREEN_PADDING * 2 - COLUMN_GAP * (COLUMNS - 1)) / COLUMNS;
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<IMovieFilters>(MOVIE_DEFAULT_FILTERS);
  const search = useDebouncedValue(
    searchText.trim(),
    SEARCH_DEBOUNCE_MILLISECONDS,
  );
  const {
    data: page,
    isPending,
    isError,
    refetch,
  } = useMoviesQuery(toMoviesQuery(filters, search));
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  function renderEmpty() {
    if (isPending) {
      return (
        <View className="flex-row flex-wrap" style={{ gap: COLUMN_GAP }}>
          {SKELETON_TILES.map((tile) => (
            <MovieCardSkeleton key={tile} width={tileWidth} />
          ))}
        </View>
      );
    }
    if (isError) {
      return (
        <SectionError
          message="Couldn't load your movies."
          onRetry={() => void refetch()}
        />
      );
    }
    return <MoviesEmpty search={search} filtered={hasActiveFilters(filters)} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color" edges={['top']}>
      <FlatList
        data={page?.items}
        keyExtractor={(movie) => movie.id}
        numColumns={COLUMNS}
        renderItem={({ item }) => <MovieCard movie={item} width={tileWidth} />}
        columnWrapperStyle={{ gap: COLUMN_GAP }}
        ListHeaderComponent={
          <View className="gap-4 pb-4">
            <MoviesHeader total={page?.total} />
            <MovieSearch value={searchText} onChangeText={setSearchText} />
            <MovieFilters filters={filters} onChange={setFilters} />
          </View>
        }
        ListEmptyComponent={renderEmpty()}
        ItemSeparatorComponent={() => <View className="h-3.5" />}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerClassName="pb-28 pt-4"
        contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING }}
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

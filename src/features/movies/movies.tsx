import { useState } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMoviePagesQuery } from '@/api/get-movies';
import { pagesItems } from '@/api/pagination';
import { NewMovieButton } from '@/components/new-movie-button';
import { SearchField } from '@/components/search-field';
import { SectionError } from '@/components/section-error';
import { useDebouncedValue } from '@/lib/use-debounced-value';
import { useLoadMore } from '@/lib/use-load-more';
import { useRefreshControl } from '@/lib/use-refresh-control';
import { MovieCard } from './components/movie-card/movie-card';
import { MovieCardSkeleton } from './components/movie-card-skeleton/movie-card-skeleton';
import { MovieFilters } from './components/movie-filters/movie-filters';
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
  const { width: screenWidth } = useWindowDimensions();
  const tileWidth =
    (screenWidth - SCREEN_PADDING * 2 - COLUMN_GAP * (COLUMNS - 1)) / COLUMNS;
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<IMovieFilters>(MOVIE_DEFAULT_FILTERS);
  const search = useDebouncedValue(
    searchText.trim(),
    SEARCH_DEBOUNCE_MILLISECONDS,
  );
  const movies = useMoviePagesQuery(toMoviesQuery(filters, search));
  const { isPending, isError, refetch } = movies;
  const refreshControl = useRefreshControl(() => refetch());
  const loadMore = useLoadMore(movies);

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
        data={pagesItems(movies.data)}
        keyExtractor={(movie) => movie.id}
        numColumns={COLUMNS}
        renderItem={({ item }) => <MovieCard movie={item} width={tileWidth} />}
        columnWrapperStyle={{ gap: COLUMN_GAP }}
        ListHeaderComponent={
          <View className="gap-4 pb-4">
            <MoviesHeader total={movies.data?.pages[0]?.total} />
            <SearchField
              label="Search movies"
              value={searchText}
              onChangeText={setSearchText}
            />
            <MovieFilters filters={filters} onChange={setFilters} />
          </View>
        }
        ListEmptyComponent={renderEmpty()}
        ItemSeparatorComponent={() => <View className="h-3.5" />}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerClassName="pb-28 pt-4"
        contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING }}
        refreshControl={refreshControl}
        {...loadMore}
      />
      <NewMovieButton />
    </SafeAreaView>
  );
}

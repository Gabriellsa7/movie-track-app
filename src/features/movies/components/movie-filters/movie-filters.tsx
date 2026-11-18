import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useGenresQuery } from '@/api/get-genres';
import { OptionSheet, type IOption } from '@/components/option-sheet';
import {
  MOVIE_SORT_OPTIONS,
  movieSortLabel,
  type TMovieSortKey,
} from '@/lib/movie-sort';
import type { IMovieFilters } from '../../constants/constants';
import { FilterChip } from '@/components/filter-chip';

interface IMovieFiltersProps {
  filters: IMovieFilters;
  onChange: (filters: IMovieFilters) => void;
}

const ALL_GENRES = '';

export function MovieFilters({ filters, onChange }: IMovieFiltersProps) {
  const genres = useGenresQuery();
  const [sheet, setSheet] = useState<'genre' | 'sort' | null>(null);
  const genreOptions: IOption<string>[] = [
    { label: 'All genres', value: ALL_GENRES },
    ...(genres.data ?? []).map((genre) => ({
      label: genre.name,
      value: genre.id,
    })),
  ];
  const genreName = genres.data?.find(
    (genre) => genre.id === filters.genreId,
  )?.name;
  const sortLabel = movieSortLabel(filters.sort);

  function close() {
    setSheet(null);
  }

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-5"
        contentContainerClassName="gap-2 px-5"
      >
        <FilterChip
          label="Favorites"
          active={filters.favorite}
          onPress={() => {
            onChange({ ...filters, favorite: !filters.favorite });
          }}
        />
        <FilterChip
          label={genreName ?? 'Genre'}
          active={Boolean(genreName)}
          withMenu
          onPress={() => {
            setSheet('genre');
          }}
        />
        <FilterChip
          label={sortLabel}
          active={filters.sort !== 'latest'}
          withMenu
          onPress={() => {
            setSheet('sort');
          }}
        />
      </ScrollView>

      <OptionSheet
        title="Genre"
        visible={sheet === 'genre'}
        options={genreOptions}
        selected={filters.genreId ?? ALL_GENRES}
        onSelect={(genreId) => {
          onChange({ ...filters, genreId: genreId || undefined });
        }}
        onClose={close}
      />
      <OptionSheet<TMovieSortKey>
        title="Sort by"
        visible={sheet === 'sort'}
        options={MOVIE_SORT_OPTIONS}
        selected={filters.sort}
        onSelect={(sort) => {
          onChange({ ...filters, sort });
        }}
        onClose={close}
      />
    </>
  );
}

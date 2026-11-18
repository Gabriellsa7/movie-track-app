import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useGenresQuery } from '@/api/get-genres';
import { OptionSheet, type IOption } from '@/components/option-sheet';
import {
  movieSortOptions,
  movieSortLabel,
  type TMovieSortKey,
} from '@/lib/movie-sort';
import type { IMovieFilters } from '../../constants/constants';
import { FilterChip } from '@/components/filter-chip';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n';

interface IMovieFiltersProps {
  filters: IMovieFilters;
  onChange: (filters: IMovieFilters) => void;
}

const ALL_GENRES = '';

export function MovieFilters({ filters, onChange }: IMovieFiltersProps) {
  const { t } = useTranslation();
  const language = useLanguage();
  const genres = useGenresQuery();
  const [sheet, setSheet] = useState<'genre' | 'sort' | null>(null);
  const genreOptions: IOption<string>[] = [
    { label: t('movies.filters.allGenres'), value: ALL_GENRES },
    ...(genres.data ?? []).map((genre) => ({
      label: genre.name,
      value: genre.id,
    })),
  ];
  const genreName = genres.data?.find(
    (genre) => genre.id === filters.genreId,
  )?.name;
  const sortLabel = movieSortLabel(filters.sort, language);

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
          label={t('movies.filters.favorites')}
          active={filters.favorite}
          onPress={() => {
            onChange({ ...filters, favorite: !filters.favorite });
          }}
        />
        <FilterChip
          label={genreName ?? t('movies.filters.genre')}
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
        title={t('movies.filters.genre')}
        visible={sheet === 'genre'}
        options={genreOptions}
        selected={filters.genreId ?? ALL_GENRES}
        onSelect={(genreId) => {
          onChange({ ...filters, genreId: genreId || undefined });
        }}
        onClose={close}
      />
      <OptionSheet<TMovieSortKey>
        title={t('movies.sort.title')}
        visible={sheet === 'sort'}
        options={movieSortOptions(language)}
        selected={filters.sort}
        onSelect={(sort) => {
          onChange({ ...filters, sort });
        }}
        onClose={close}
      />
    </>
  );
}

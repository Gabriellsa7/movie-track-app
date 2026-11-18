import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { useGenresQuery } from '@/api/get-genres';
import { OptionSheet, type IOption } from '@/components/option-sheet';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import {
  MOVIE_SORT_OPTIONS,
  type IMovieFilters,
  type TMovieSortKey,
} from '../../constants/constants';

interface IMovieFiltersProps {
  filters: IMovieFilters;
  onChange: (filters: IMovieFilters) => void;
}

const ALL_GENRES = '';

function Chip({
  label,
  active,
  withMenu = false,
  onPress,
}: {
  label: string;
  active: boolean;
  withMenu?: boolean;
  onPress: () => void;
}) {
  const scheme = useAppTheme();

  return (
    <Pressable
      accessibilityRole={withMenu ? 'button' : 'switch'}
      accessibilityState={withMenu ? undefined : { checked: active }}
      onPress={onPress}
      className={`h-9 flex-row items-center gap-1 rounded-full border px-3 ${
        active
          ? 'border-accent-bg-color bg-accent-soft-bg-color'
          : 'border-primary-border-color bg-secondary-bg-color'
      }`}
    >
      <Text
        className={`font-semibold text-[13px] ${
          active ? 'text-accent-text-color' : 'text-primary-text-color'
        }`}
      >
        {label}
      </Text>
      {withMenu && (
        <ChevronDown
          size={14}
          strokeWidth={2.4}
          color={color(
            scheme,
            active ? 'accent-text-color' : 'primary-text-color',
          )}
        />
      )}
    </Pressable>
  );
}

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
  const sortLabel =
    MOVIE_SORT_OPTIONS.find((option) => option.value === filters.sort)?.label ??
    '';

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
        <Chip
          label="Favorites"
          active={filters.favorite}
          onPress={() => {
            onChange({ ...filters, favorite: !filters.favorite });
          }}
        />
        <Chip
          label={genreName ?? 'Genre'}
          active={Boolean(genreName)}
          withMenu
          onPress={() => {
            setSheet('genre');
          }}
        />
        <Chip
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

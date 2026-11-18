import { Search } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTmdbSearchQuery } from '@/api/get-tmdb-search';
import type { ITmdbMovie } from '@/api/types';
import { Poster } from '@/components/poster';
import { useDebouncedValue } from '@/lib/use-debounced-value';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

const SEARCH_DEBOUNCE_MILLISECONDS = 400;
const MAX_RESULTS = 5;

interface ITmdbSearchProps {
  placeholder: string;
  onSelect: (movie: ITmdbMovie) => void;
}

export function TmdbSearch({ placeholder, onSelect }: ITmdbSearchProps) {
  const scheme = useAppTheme();
  const [text, setText] = useState('');
  const query = useDebouncedValue(text.trim(), SEARCH_DEBOUNCE_MILLISECONDS);
  const search = useTmdbSearchQuery({ query });
  const isSearching = search.fetchStatus === 'fetching';
  const results = text.trim() ? search.data?.items.slice(0, MAX_RESULTS) : [];

  function select(movie: ITmdbMovie) {
    onSelect(movie);
    setText('');
  }

  return (
    <View className="gap-2">
      <View className="justify-center">
        <View className="absolute left-3.5 z-10">
          <Search size={18} color={color(scheme, 'tertiary-text-color')} />
        </View>
        <TextInput
          value={text}
          onChangeText={setText}
          accessibilityLabel="Search TMDB"
          placeholder={placeholder}
          placeholderTextColor={color(scheme, 'tertiary-text-color')}
          autoCorrect={false}
          returnKeyType="search"
          className="min-h-[48px] rounded-xl border border-primary-border-color bg-secondary-bg-color pl-11 pr-11 font-sans text-base text-primary-text-color"
        />
        {isSearching && (
          <View className="absolute right-3.5">
            <ActivityIndicator color={color(scheme, 'tertiary-text-color')} />
          </View>
        )}
      </View>

      {search.isError && text.trim() ? (
        <Text className="font-sans text-xs text-tertiary-text-color">
          Search is unavailable right now. Fill in the fields below.
        </Text>
      ) : null}
      {results?.length === 0 && query && !isSearching && !search.isError ? (
        <Text className="font-sans text-xs text-tertiary-text-color">
          No results. Fill in the fields below.
        </Text>
      ) : null}

      {results?.map((movie) => (
        <Pressable
          key={movie.tmdbId}
          accessibilityRole="button"
          accessibilityLabel={`Fill with ${movie.title}${
            movie.releaseYear ? `, ${String(movie.releaseYear)}` : ''
          }`}
          onPress={() => {
            select(movie);
          }}
          className="flex-row items-center gap-3 rounded-xl border border-primary-border-color bg-secondary-bg-color p-2 active:opacity-80"
        >
          <Poster
            title={movie.title}
            posterUrl={movie.posterUrl}
            showTitle={false}
            className="h-[60px] w-[40px] rounded-md"
          />
          <View className="flex-1">
            <Text
              numberOfLines={1}
              className="font-semibold text-sm text-primary-text-color"
            >
              {movie.title}
            </Text>
            <Text className="font-sans text-xs text-tertiary-text-color">
              {movie.releaseYear ?? 'Unknown year'}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

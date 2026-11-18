import { Pressable, Text, View } from 'react-native';
import { useGenresQuery } from '@/api/get-genres';
import { Poster } from '@/components/poster';

interface ISelectedMovieCardProps {
  title: string;
  releaseYear: string;
  genreIds: string[];
  posterUrl: string | undefined;
  onChange: () => void;
}

export function SelectedMovieCard({
  title,
  releaseYear,
  genreIds,
  posterUrl,
  onChange,
}: ISelectedMovieCardProps) {
  const genres = useGenresQuery();
  const meta = [
    releaseYear,
    ...genreIds.map(
      (genreId) => genres.data?.find((genre) => genre.id === genreId)?.name,
    ),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View className="flex-row gap-3.5 rounded-xl border border-primary-border-color bg-sidebar-bg-color p-3">
      <Poster
        title={title}
        posterUrl={posterUrl}
        showTitle={false}
        className="h-[84px] w-14 rounded-lg"
      />
      <View className="min-w-0 flex-1 gap-1">
        <Text
          numberOfLines={2}
          className="font-semibold text-base text-primary-text-color"
        >
          {title}
        </Text>
        {meta ? (
          <Text
            numberOfLines={2}
            className="font-sans text-[13px] text-tertiary-text-color"
          >
            {meta}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={onChange}
          className="mt-auto h-7 justify-center self-start"
        >
          <Text className="font-semibold text-[13px] text-accent-text-color">
            Change movie
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

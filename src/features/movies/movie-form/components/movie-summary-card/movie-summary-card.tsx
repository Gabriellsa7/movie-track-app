import { Pressable, Text, View } from 'react-native';
import { useGenreNames } from '@/api/get-genres';
import { Poster } from '@/components/poster';

interface IMovieSummaryCardProps {
  title: string;
  releaseYear: string;
  genreIds: string[];
  posterUrl: string | undefined;
  onEdit: () => void;
}

export function MovieSummaryCard({
  title,
  releaseYear,
  genreIds,
  posterUrl,
  onEdit,
}: IMovieSummaryCardProps) {
  const genreNames = useGenreNames(genreIds).join(', ');

  return (
    <View className="flex-row gap-3 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-3">
      <Poster
        title={title}
        posterUrl={posterUrl}
        showTitle={false}
        className="h-24 w-16 rounded-lg"
      />
      <View className="min-w-0 flex-1 gap-1">
        <Text
          numberOfLines={2}
          className="font-semibold text-base text-primary-text-color"
        >
          {title}
        </Text>
        {releaseYear ? (
          <Text className="font-sans text-[13px] text-tertiary-text-color">
            {releaseYear}
          </Text>
        ) : null}
        {genreNames ? (
          <Text
            numberOfLines={1}
            className="font-sans text-[13px] text-tertiary-text-color"
          >
            {genreNames}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={onEdit}
          className="mt-auto h-8 justify-center self-start"
        >
          <Text className="font-semibold text-[13px] text-accent-text-color">
            Edit movie details
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

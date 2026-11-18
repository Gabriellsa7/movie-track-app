import { Pressable, Text, View } from 'react-native';
import { useGenreNames } from '@/api/get-genres';
import { Poster } from '@/components/poster';
import { useTranslation } from 'react-i18next';

interface IMovieSummaryCardProps {
  title: string;
  releaseYear: string;
  genreIds: string[];
  director?: string;
  durationMinutes?: string;
  posterUrl: string | undefined;
  onEdit: () => void;
}

export function MovieSummaryCard({
  title,
  releaseYear,
  genreIds,
  director,
  durationMinutes,
  posterUrl,
  onEdit,
}: IMovieSummaryCardProps) {
  const { t } = useTranslation();
  const genreNames = useGenreNames(genreIds).join(', ');
  const credits = [director, durationMinutes && `${durationMinutes} min`]
    .filter(Boolean)
    .join(' · ');

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
        {credits ? (
          <Text
            numberOfLines={1}
            className="font-sans text-[13px] text-tertiary-text-color"
          >
            {credits}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={onEdit}
          className="mt-auto h-8 justify-center self-start"
        >
          <Text className="font-semibold text-[13px] text-accent-text-color">
            {t('common.editMovieDetails')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

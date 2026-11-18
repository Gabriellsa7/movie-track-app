import { Text, View } from 'react-native';
import { Skeleton } from '@/components/skeleton';
import { useTranslation } from 'react-i18next';

interface IMoviesHeaderProps {
  total: number | undefined;
}

export function MoviesHeader({ total }: IMoviesHeaderProps) {
  const { t } = useTranslation();
  return (
    <View className="gap-1">
      <Text
        accessibilityRole="header"
        className="font-display text-title-sm tracking-[1px] text-primary-text-color"
      >
        {t('movies.title')}
      </Text>
      {total === undefined ? (
        <Skeleton className="h-4 w-24 rounded" />
      ) : (
        <Text className="font-sans text-sm text-tertiary-text-color">
          {t('movies.count', { count: total })}
        </Text>
      )}
    </View>
  );
}

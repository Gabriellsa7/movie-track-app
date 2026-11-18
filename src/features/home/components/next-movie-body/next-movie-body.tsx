import { Link } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useWatchlistQuery } from '@/api/get-watchlist';
import { Poster } from '@/components/poster';
import { SectionError } from '@/components/section-error';
import { Skeleton } from '@/components/skeleton';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { plannedLabel, priorityLabel } from '@/lib/watchlist';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n';

export const NEXT_MOVIE_QUERY = {
  planned: true,
  sort: 'plannedFor',
  limit: 1,
} as const;

export function NextMovieBody() {
  const { t } = useTranslation();
  const language = useLanguage();
  const scheme = useAppTheme();
  const { data, isPending, isError, refetch } =
    useWatchlistQuery(NEXT_MOVIE_QUERY);

  if (isPending) {
    return <Skeleton className="h-[116px] rounded-[14px]" />;
  }
  if (isError) {
    return (
      <SectionError
        message={t('home.next.loadFailed')}
        onRetry={() => void refetch()}
      />
    );
  }

  const item = data.items[0];
  if (!item?.plannedFor) {
    return (
      <View className="gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
        <Text className="font-semibold text-sm text-primary-text-color">
          {t('home.next.emptyTitle')}
        </Text>
        <Text className="font-sans text-caption text-tertiary-text-color">
          {t('home.next.emptyBody')}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row gap-3.5 rounded-[14px] border border-accent-border-color bg-accent-soft-bg-color p-3">
      <Poster
        title={item.title}
        posterUrl={item.posterUrl}
        showTitle={false}
        className="h-[90px] w-[60px] rounded-lg"
      />
      <View className="min-w-0 flex-1 gap-1">
        <Text
          numberOfLines={2}
          className="font-semibold text-heading text-primary-text-color"
        >
          {item.title}
        </Text>
        <Text className="font-sans text-caption text-secondary-text-color">
          {plannedLabel(item.plannedFor, new Date(), language)} ·{' '}
          {priorityLabel(item.priority, language)}
        </Text>
        <Link
          href={{
            pathname: '/watchlist/[itemId]/watched',
            params: { itemId: item.id },
          }}
          asChild
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('home.next.markWatched', {
              title: item.title,
            })}
            className="mt-auto h-9 flex-row items-center gap-1.5 self-start rounded-lg bg-accent-bg-color px-3.5"
          >
            <Check
              size={16}
              strokeWidth={2.6}
              color={color(scheme, 'on-accent-text-color')}
            />
            <Text className="font-semibold text-label text-on-accent-text-color">
              {t('home.next.watchedIt')}
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

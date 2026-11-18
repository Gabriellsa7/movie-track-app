import { Link } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { Poster } from '@/components/poster';
import { Skeleton } from '@/components/skeleton';
import { useWatchlistQuery } from '@/api/get-watchlist';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';
import { plannedLabel, priorityLabel } from '../../utils/home.utils';
import { SectionError } from '../section-error/section-error';
import { SectionHeader } from '../section-header/section-header';

export const NEXT_MOVIE_QUERY = {
  planned: true,
  sort: 'plannedFor',
  limit: 1,
} as const;

function NextMovieBody() {
  const scheme = useAppTheme();
  const { data, isPending, isError, refetch } =
    useWatchlistQuery(NEXT_MOVIE_QUERY);

  if (isPending) {
    return <Skeleton className="h-[116px] rounded-[14px]" />;
  }
  if (isError) {
    return (
      <SectionError
        message="Não foi possível carregar o próximo filme."
        onRetry={() => void refetch()}
      />
    );
  }

  const item = data.items[0];
  if (!item?.plannedFor) {
    return (
      <View className="gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
        <Text className="font-semibold text-sm text-primary-text-color">
          Nenhum filme com data marcada
        </Text>
        <Text className="font-sans text-caption text-tertiary-text-color">
          Escolha um dia para algum filme da sua lista.
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
          {plannedLabel(item.plannedFor, new Date())} ·{' '}
          {priorityLabel(item.priority)}
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
            accessibilityLabel={`Marcar ${item.title} como assistido`}
            className="mt-auto h-9 flex-row items-center gap-1.5 self-start rounded-lg bg-accent-bg-color px-3.5"
          >
            <Check
              size={16}
              strokeWidth={2.6}
              color={color(scheme, 'on-accent-text-color')}
            />
            <Text className="font-semibold text-label text-on-accent-text-color">
              Assisti
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

export function NextMovie() {
  return (
    <View className="gap-2.5">
      <SectionHeader
        title="Próximo filme"
        linkLabel="Ver lista"
        href={ROUTES.watchlist}
      />
      <NextMovieBody />
    </View>
  );
}

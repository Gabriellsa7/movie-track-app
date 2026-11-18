import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Check, Ellipsis } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import type { IWatchlistItem } from '@/api/types';
import { isPlannedForToday, plannedLabel } from '@/lib/watchlist';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { PriorityBadge } from '../priority-badge/priority-badge';

interface IWatchlistItemCardProps {
  item: IWatchlistItem;
  onMoreOptions: (item: IWatchlistItem) => void;
}

export function WatchlistItemCard({
  item,
  onMoreOptions,
}: IWatchlistItemCardProps) {
  const scheme = useAppTheme();
  const today = new Date();
  const isDue = item.plannedFor
    ? isPlannedForToday(item.plannedFor, today)
    : false;

  return (
    <View className="flex-row gap-3 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-3">
      <View className="h-[102px] w-[68px] justify-end overflow-hidden rounded-lg border border-primary-border-color bg-tertiary-bg-color p-1.5">
        {item.posterUrl ? (
          <Image
            source={{ uri: item.posterUrl }}
            accessibilityLabel={`Poster of ${item.title}`}
            contentFit="cover"
            transition={150}
            style={{ position: 'absolute', inset: 0 }}
          />
        ) : (
          <Text
            numberOfLines={4}
            className="font-display text-[15px] leading-[15px] text-primary-text-color"
          >
            {item.title}
          </Text>
        )}
      </View>
      <View className="min-w-0 flex-1 gap-1.5">
        <View className="flex-row items-center justify-between gap-2">
          <Text
            numberOfLines={1}
            className="flex-1 font-semibold text-[15px] text-primary-text-color"
          >
            {item.title}
          </Text>
          <PriorityBadge priority={item.priority} />
        </View>
        {item.plannedFor ? (
          <Text
            className={`font-semibold text-[13px] ${
              isDue ? 'text-accent-text-color' : 'text-secondary-text-color'
            }`}
          >
            {plannedLabel(item.plannedFor, today, { withWeekday: true })}
          </Text>
        ) : item.releaseYear ? (
          <Text className="font-sans text-[13px] text-tertiary-text-color">
            {item.releaseYear}
          </Text>
        ) : null}
        {item.note ? (
          <Text
            numberOfLines={1}
            className="font-sans text-[13px] text-tertiary-text-color"
          >
            {item.note}
          </Text>
        ) : null}
        <View className="mt-0.5 flex-row gap-2">
          <Link
            href={{
              pathname: '/watchlist/[itemId]/watched',
              params: { itemId: item.id },
            }}
            asChild
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Mark ${item.title} as watched`}
              className="h-9 flex-row items-center gap-1.5 rounded-lg bg-accent-bg-color px-3 active:bg-accent-hover-bg-color"
            >
              <Check
                size={15}
                strokeWidth={2.6}
                color={color(scheme, 'on-accent-text-color')}
              />
              <Text className="font-semibold text-[13px] text-on-accent-text-color">
                Watched it
              </Text>
            </Pressable>
          </Link>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`More options for ${item.title}`}
            onPress={() => {
              onMoreOptions(item);
            }}
            className="h-9 w-9 items-center justify-center rounded-lg border border-primary-border-color"
          >
            <Ellipsis size={18} color={color(scheme, 'secondary-text-color')} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

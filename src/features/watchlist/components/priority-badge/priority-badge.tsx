import { Text, View } from 'react-native';
import type { IWatchlistItem } from '@/api/types';
import { PRIORITY_SHORT_LABELS } from '@/lib/watchlist';

const STYLES: Record<
  IWatchlistItem['priority'],
  { box: string; text: string }
> = {
  high: { box: 'bg-accent-bg-color', text: 'text-on-accent-text-color' },
  medium: { box: 'bg-primary-border-color', text: 'text-primary-text-color' },
  low: {
    box: 'border border-secondary-border-color',
    text: 'text-tertiary-text-color',
  },
};

export function PriorityBadge({
  priority,
}: {
  priority: IWatchlistItem['priority'];
}) {
  const style = STYLES[priority];

  return (
    <View
      accessibilityLabel={`${PRIORITY_SHORT_LABELS[priority]} priority`}
      className={`h-[22px] justify-center rounded-full px-2 ${style.box}`}
    >
      <Text className={`font-semibold text-[11px] ${style.text}`}>
        {PRIORITY_SHORT_LABELS[priority]}
      </Text>
    </View>
  );
}

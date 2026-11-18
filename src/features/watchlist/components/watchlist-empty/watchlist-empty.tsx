import { Text, View } from 'react-native';
import type { TWatchlistTab } from '../watchlist-tabs/watchlist-tabs';

const MESSAGES: Record<TWatchlistTab, [string, string]> = {
  upcoming: [
    'Nothing scheduled',
    'Give a movie a date and it shows up here, soonest first.',
  ],
  someday: [
    'No movies for someday',
    'Tap + to save a movie you want to watch.',
  ],
};

export function WatchlistEmpty({ tab }: { tab: TWatchlistTab }) {
  const [title, hint] = MESSAGES[tab];

  return (
    <View className="gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
      <Text className="font-semibold text-sm text-primary-text-color">
        {title}
      </Text>
      <Text className="font-sans text-caption text-tertiary-text-color">
        {hint}
      </Text>
    </View>
  );
}

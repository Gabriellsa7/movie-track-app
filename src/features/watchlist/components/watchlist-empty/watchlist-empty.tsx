import { Text, View } from 'react-native';
import type { TWatchlistTab } from '../watchlist-tabs/watchlist-tabs';
import { useTranslation } from 'react-i18next';

const MESSAGES = {
  upcoming: ['watchlist.empty.upcomingTitle', 'watchlist.empty.upcomingHint'],
  someday: ['watchlist.empty.somedayTitle', 'watchlist.empty.somedayHint'],
} as const satisfies Record<TWatchlistTab, readonly [string, string]>;

export function WatchlistEmpty({ tab }: { tab: TWatchlistTab }) {
  const { t } = useTranslation();
  const [titleKey, hintKey] = MESSAGES[tab];
  const title = t(titleKey);
  const hint = t(hintKey);

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

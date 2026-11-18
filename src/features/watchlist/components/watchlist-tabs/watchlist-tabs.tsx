import { Pressable, Text, View } from 'react-native';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

export type TWatchlistTab = 'upcoming' | 'someday';

interface IWatchlistTabsProps {
  active: TWatchlistTab;
  upcomingCount: number | undefined;
  somedayCount: number | undefined;
  onChange: (tab: TWatchlistTab) => void;
}

function label(t: TFunction, name: string, count: number | undefined): string {
  return count === undefined
    ? name
    : t('watchlist.tabs.withCount', { name, count });
}

export function WatchlistTabs({
  active,
  upcomingCount,
  somedayCount,
  onChange,
}: IWatchlistTabsProps) {
  const { t } = useTranslation();
  const tabs: { id: TWatchlistTab; text: string }[] = [
    {
      id: 'upcoming',
      text: label(t, t('watchlist.tabs.upcoming'), upcomingCount),
    },
    {
      id: 'someday',
      text: label(t, t('watchlist.tabs.someday'), somedayCount),
    },
  ];

  return (
    <View
      accessibilityRole="tablist"
      className="flex-row rounded-xl border border-primary-border-color bg-secondary-bg-color p-1"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => {
              onChange(tab.id);
            }}
            className={`h-10 flex-1 items-center justify-center rounded-[9px] ${
              isActive ? 'bg-tertiary-bg-color' : ''
            }`}
          >
            <Text
              className={`font-semibold text-sm ${
                isActive
                  ? 'text-primary-text-color'
                  : 'text-tertiary-text-color'
              }`}
            >
              {tab.text}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

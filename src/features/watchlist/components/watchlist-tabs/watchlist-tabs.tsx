import { Pressable, Text, View } from 'react-native';

export type TWatchlistTab = 'upcoming' | 'someday';

interface IWatchlistTabsProps {
  active: TWatchlistTab;
  upcomingCount: number | undefined;
  somedayCount: number | undefined;
  onChange: (tab: TWatchlistTab) => void;
}

function label(name: string, count: number | undefined): string {
  return count === undefined ? name : `${name} · ${String(count)}`;
}

export function WatchlistTabs({
  active,
  upcomingCount,
  somedayCount,
  onChange,
}: IWatchlistTabsProps) {
  const tabs: { id: TWatchlistTab; text: string }[] = [
    { id: 'upcoming', text: label('Upcoming', upcomingCount) },
    { id: 'someday', text: label('Someday', somedayCount) },
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

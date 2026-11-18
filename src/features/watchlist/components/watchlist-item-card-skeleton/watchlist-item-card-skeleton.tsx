import { View } from 'react-native';

export function WatchlistItemCardSkeleton() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="h-[128px] flex-row gap-3 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-3"
    >
      <View className="h-[102px] w-[68px] rounded-lg bg-tertiary-bg-color" />
    </View>
  );
}

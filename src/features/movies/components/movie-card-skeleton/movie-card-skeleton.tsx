import { View } from 'react-native';

// Same size as MovieCard, so the list doesn't jump when the movies arrive.
export function MovieCardSkeleton() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="h-[112px] rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-2.5"
    >
      <View className="h-[90px] w-[60px] rounded-lg bg-tertiary-bg-color" />
    </View>
  );
}

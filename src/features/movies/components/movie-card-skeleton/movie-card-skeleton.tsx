import { View } from 'react-native';

export function MovieCardSkeleton({ width }: { width: number }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="gap-1.5"
      style={{ width }}
    >
      <View
        className="rounded-lg bg-tertiary-bg-color"
        style={{ width, aspectRatio: 2 / 3 }}
      />
      <View className="h-3 w-3/4 rounded bg-tertiary-bg-color" />
    </View>
  );
}

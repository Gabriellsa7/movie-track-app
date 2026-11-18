import { View } from 'react-native';

export function Skeleton({ className }: { className?: string }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={`bg-tertiary-bg-color ${className ?? ''}`}
    />
  );
}

import { View } from 'react-native';

// A loading block; give it the size and radius of what it stands for.
export function Skeleton({ className }: { className?: string }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={`bg-tertiary-bg-color ${className ?? ''}`}
    />
  );
}

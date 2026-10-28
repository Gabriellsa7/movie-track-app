import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Stands in for each screen until it is built from the approved mockups.
export function ScreenPlaceholder({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 px-5 pt-4">
        <Text
          accessibilityRole="header"
          className="font-display text-4xl text-text"
        >
          {title}
        </Text>
        {children}
      </View>
    </SafeAreaView>
  );
}

import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface IStatsSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function StatsSection({
  title,
  description,
  children,
}: IStatsSectionProps) {
  return (
    <View className="gap-3.5 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
      <View className="gap-1">
        <Text
          accessibilityRole="header"
          className="font-semibold text-base text-primary-text-color"
        >
          {title}
        </Text>
        <Text className="font-sans text-xs leading-4 text-tertiary-text-color">
          {description}
        </Text>
      </View>
      {children}
    </View>
  );
}

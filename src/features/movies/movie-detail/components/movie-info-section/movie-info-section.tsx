import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface IMovieInfoSectionProps {
  title: string;
  children: ReactNode;
}

export function MovieInfoSection({ title, children }: IMovieInfoSectionProps) {
  return (
    <View className="gap-2">
      <Text
        accessibilityRole="header"
        className="font-semibold text-sm text-tertiary-text-color"
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

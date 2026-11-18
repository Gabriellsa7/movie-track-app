import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface IMovieInfoSectionProps {
  title: string;
  children: ReactNode;
  card?: boolean;
}

export function MovieInfoSection({
  title,
  children,
  card = false,
}: IMovieInfoSectionProps) {
  return (
    <View
      className={
        card
          ? 'gap-2 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-3.5'
          : 'gap-1.5'
      }
    >
      <Text
        accessibilityRole="header"
        className="font-semibold text-xs uppercase tracking-[1px] text-tertiary-text-color"
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

import type { ReactNode } from 'react';
import { Pressable } from 'react-native';

interface IHeroButtonProps {
  label: string;
  onPress: () => void;
  children: ReactNode;
}

export function HeroButton({ label, onPress, children }: IHeroButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="h-11 w-11 items-center justify-center rounded-xl bg-overlay-bg-color/70"
    >
      {children}
    </Pressable>
  );
}

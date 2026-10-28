import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface IFieldFrameProps {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

// Label, hint and error shared by every input.
export function FieldFrame({ label, error, hint, children }: IFieldFrameProps) {
  return (
    <View className="gap-1.5">
      <Text className="font-semibold text-sm text-text">{label}</Text>
      {children}
      {hint && !error && (
        <Text className="font-sans text-xs text-text-muted">{hint}</Text>
      )}
      {error && (
        <Text
          accessibilityRole="alert"
          className="font-medium text-xs text-danger"
        >
          {error}
        </Text>
      )}
    </View>
  );
}

export function inputClassName(invalid: boolean) {
  return `min-h-[52px] rounded-xl border bg-surface px-3.5 font-sans text-base text-text ${
    invalid ? 'border-danger' : 'border-border'
  }`;
}

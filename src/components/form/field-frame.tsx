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
      <Text className="font-semibold text-sm text-primary-text-color">
        {label}
      </Text>
      {children}
      {hint && !error && (
        <Text className="font-sans text-xs text-tertiary-text-color">
          {hint}
        </Text>
      )}
      {error && (
        <Text
          accessibilityRole="alert"
          className="font-medium text-xs text-danger-text-color"
        >
          {error}
        </Text>
      )}
    </View>
  );
}

export function inputClassName(invalid: boolean) {
  return `min-h-[52px] rounded-xl border bg-secondary-bg-color px-3.5 font-sans text-base text-primary-text-color ${
    invalid ? 'border-danger-border-color' : 'border-primary-border-color'
  }`;
}

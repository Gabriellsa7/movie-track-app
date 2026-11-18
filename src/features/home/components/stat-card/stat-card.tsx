import { Text, View } from 'react-native';

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      className="min-w-[40%] flex-1 gap-1.5 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-3.5"
    >
      <Text className="font-sans text-small text-tertiary-text-color">
        {label}
      </Text>
      <Text className="font-display text-[34px] leading-[34px] text-primary-text-color">
        {value}
      </Text>
    </View>
  );
}

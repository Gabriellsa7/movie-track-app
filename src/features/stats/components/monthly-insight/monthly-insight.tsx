import { Text, View } from 'react-native';

export function Insight({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 gap-0.5">
      <Text className="font-sans text-xs text-tertiary-text-color">
        {label}
      </Text>
      <Text className="font-semibold text-sm text-primary-text-color">
        {value}
      </Text>
    </View>
  );
}

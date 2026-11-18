import { Text, View } from 'react-native';

interface IMetricCardProps {
  label: string;
  value: string;
  description: string;
}

export function MetricCard({ label, value, description }: IMetricCardProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}. ${description}`}
      className="min-w-[45%] flex-1 gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-3.5"
    >
      <Text className="font-sans text-xs text-tertiary-text-color">
        {label}
      </Text>
      <Text className="font-display text-[34px] leading-[36px] text-primary-text-color">
        {value}
      </Text>
      <Text className="font-sans text-xs leading-4 text-tertiary-text-color">
        {description}
      </Text>
    </View>
  );
}

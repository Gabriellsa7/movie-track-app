import { Text, View } from 'react-native';
import { LogoMark } from './logo-mark';

export function Logo() {
  return (
    <View className="flex-row items-center gap-2.5">
      <LogoMark />
      <Text className="font-display text-stat text-primary-text-color">
        Movie Track
      </Text>
    </View>
  );
}

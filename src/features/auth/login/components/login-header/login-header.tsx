import { LogoMark } from '@/components/logo-mark';
import { Text, View } from 'react-native';

export function LoginHeader() {
  return (
    <View className="gap-5">
      <LogoMark size={56} />
      <View className="gap-3">
        <Text
          accessibilityRole="header"
          className="font-display text-[52px] leading-[58px] tracking-[1px] text-primary-text-color"
        >
          {'YOUR MOVIE\nDIARY'}
        </Text>
        <Text className="font-sans text-body text-tertiary-text-color">
          Log what you watched, rate it and plan what to watch next.
        </Text>
      </View>
    </View>
  );
}

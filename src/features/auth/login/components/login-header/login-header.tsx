import { LogoMark } from '@/components/logo';
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
          {'SEU DIÁRIO\nDE CINEMA'}
        </Text>
        <Text className="font-sans text-body text-tertiary-text-color">
          Registre o que assistiu, dê sua nota e planeje os próximos filmes.
        </Text>
      </View>
    </View>
  );
}

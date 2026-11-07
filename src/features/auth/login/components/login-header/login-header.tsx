import { LogoMark } from '@/components/logo';
import { Text, View } from 'react-native';

export function LoginHeader() {
  return (
    <View className="gap-5 pt-16">
      <LogoMark size={80} />
      <Text className="text-title-sm text-primary-text-color">
        SEU DIÁRIO DE CINEMA
      </Text>
      <Text className="text-lg text-tertiary-text-color">
        Registre o que assistiu, dê sua nota e planeje os próximos filmes.
      </Text>
    </View>
  );
}

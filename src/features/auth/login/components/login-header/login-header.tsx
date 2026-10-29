import { LogoMark } from '@/components/logo';
import { Text, View } from 'react-native';

export function LoginHeader() {
  return (
    <View className="items-center pt-16">
      <LogoMark size={80} />
      <Text className="text-title-sm text-primary-text-color">
        SEU DIÁRIO DE CINEMA
      </Text>
      <Text className="text-center text-sm text-primary-text-color">
        Registre o que assistiu, dê sua nota e planeje os próximos filmes.
      </Text>
    </View>
  );
}

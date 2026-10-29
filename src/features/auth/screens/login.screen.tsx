import { LogoMark } from '@/components/logo';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color" edges={['top']}>
      <View>
        <LogoMark size={80} />
        <Text>SEU DIÁRIO DE CINEMA</Text>
        <Text>
          Registre o que assistiu, dê sua nota e planeje os próximos filmes.
        </Text>
      </View>
    </SafeAreaView>
  );
}

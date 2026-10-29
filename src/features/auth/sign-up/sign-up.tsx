import { ROUTES } from '@/routes/routes.constants';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function SignUpScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color px-6" edges={['top']}>
      <View className="pb-10">
        <Text className="text-center text-sm text-primary-text-color">
          Já tem conta?
          <Link href={ROUTES.login}>
            <Text className="font-bold text-accent-text-color">Entrar</Text>
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}

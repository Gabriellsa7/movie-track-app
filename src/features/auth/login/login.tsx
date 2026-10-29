import { ROUTES } from '@/routes/routes.constants';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginForm } from './components/login-form/login-form';
import { LoginHeader } from './components/login-header/login-header';

export function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color px-6" edges={['top']}>
      <LoginHeader />
      <LoginForm />

      <View className="pb-10">
        <Text className="text-center text-sm text-primary-text-color">
          Não possui uma conta?{' '}
          <Link href={ROUTES.signUp}>
            <Text className="font-bold text-accent-text-color">
              Cadastre-se
            </Text>
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}

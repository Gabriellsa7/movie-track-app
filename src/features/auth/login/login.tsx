import { Link } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROUTES } from '@/routes/routes.constants';
import { LoginForm } from './components/login-form/login-form';
import { LoginHeader } from './components/login-header/login-header';

export function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="grow gap-9 px-6 pb-10 pt-[72px]"
          keyboardShouldPersistTaps="handled"
        >
          <LoginHeader />
          <LoginForm />

          <View className="mt-auto items-center gap-4">
            <Text className="font-sans text-sm text-tertiary-text-color">
              Ainda não tem conta?{' '}
              <Link href={ROUTES.signUp} asChild>
                <Text className="font-semibold text-accent-text-color">
                  Criar conta
                </Text>
              </Link>
            </Text>
            <Link href={ROUTES.explore} asChild>
              <Text className="font-semibold text-sm text-secondary-text-color">
                Explorar perfis sem entrar
              </Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

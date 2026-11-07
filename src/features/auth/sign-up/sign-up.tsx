import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SignUpForm } from './components/sign-up-form/sign-up-form';
import { SignUpHeader } from './components/sign-up-header/sign-up-header';

export function SignUpScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="grow gap-5 px-6 pb-8 pt-4"
          keyboardShouldPersistTaps="handled"
        >
          <SignUpHeader />
          <SignUpForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NewMovieForm } from './components/new-movie-form/new-movie-form';

export function MovieFormScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <NewMovieForm />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

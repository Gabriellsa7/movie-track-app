import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MovieEditor } from './components/movie-editor/movie-editor';

export function MovieFormScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <MovieEditor />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MovieFormHeader } from './components/movie-form-header/movie-form-header';
import { NewMovieForm } from './components/new-movie-form/new-movie-form';

export function MovieFormScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="gap-6 px-5 pb-10 pt-4"
          keyboardShouldPersistTaps="handled"
        >
          <MovieFormHeader title="Log a movie" />
          <NewMovieForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

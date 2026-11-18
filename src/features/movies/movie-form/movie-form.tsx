import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MovieEditor } from './components/movie-editor/movie-editor';
import { TemplateMovieEditor } from './components/template-movie-editor/template-movie-editor';

export function MovieFormScreen() {
  const { fromUserId, fromMovieId } = useLocalSearchParams<{
    fromUserId?: string;
    fromMovieId?: string;
  }>();

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {fromUserId && fromMovieId ? (
          <TemplateMovieEditor userId={fromUserId} movieId={fromMovieId} />
        ) : (
          <MovieEditor />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

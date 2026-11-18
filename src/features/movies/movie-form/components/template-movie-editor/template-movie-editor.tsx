import { View } from 'react-native';
import { Skeleton } from '@/components/skeleton';
import { useUserMovieQuery } from '@/features/users/api/get-user-movie';
import { MovieEditor } from '../movie-editor/movie-editor';

interface ITemplateMovieEditorProps {
  userId: string;
  movieId: string;
}

export function TemplateMovieEditor({
  userId,
  movieId,
}: ITemplateMovieEditorProps) {
  const template = useUserMovieQuery(userId, movieId);

  if (template.isPending) {
    return (
      <View className="gap-4 px-5 pt-4">
        <Skeleton className="h-40 rounded-xl" />
      </View>
    );
  }
  return <MovieEditor template={template.data} />;
}

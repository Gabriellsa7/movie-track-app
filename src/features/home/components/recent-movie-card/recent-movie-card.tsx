import { Link } from 'expo-router';
import { Star } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import type { IMovie } from '@/api/types';
import { Poster } from '@/components/poster';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

export function RecentMovieCard({ movie }: { movie: IMovie }) {
  const scheme = useAppTheme();

  return (
    <Link
      href={{ pathname: '/movies/[movieId]', params: { movieId: movie.id } }}
      asChild
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`${movie.title}, rating ${movie.rating}`}
        className="w-[104px] gap-1.5"
      >
        <Poster
          title={movie.title}
          posterUrl={movie.posterUrl}
          className="h-[156px] w-[104px] rounded-[10px]"
        />
        <View className="flex-row items-center gap-1">
          <Star
            size={12}
            color={color(scheme, 'star-filled-color')}
            fill={color(scheme, 'star-filled-color')}
          />
          <Text className="font-semibold text-small text-primary-text-color">
            {movie.rating}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

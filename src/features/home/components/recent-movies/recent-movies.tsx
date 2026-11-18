import { Link } from 'expo-router';
import { Star } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { IMovie } from '@/api/types';
import { Poster } from '@/components/poster';
import { Skeleton } from '@/components/skeleton';
import { useMoviesQuery } from '@/api/get-movies';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';
import { SectionError } from '@/components/section-error';
import { SectionHeader } from '../section-header/section-header';

export const RECENT_MOVIES_QUERY = {
  sort: 'watchedAt',
  order: 'desc',
  limit: 6,
} as const;

function RecentMovieCard({ movie }: { movie: IMovie }) {
  const scheme = useAppTheme();

  return (
    <Link
      href={{ pathname: '/movies/[movieId]', params: { movieId: movie.id } }}
      asChild
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`${movie.title}, nota ${movie.rating}`}
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

function RecentMoviesBody() {
  const { data, isPending, isError, refetch } =
    useMoviesQuery(RECENT_MOVIES_QUERY);

  if (isPending) {
    return (
      <View className="flex-row gap-3">
        {[0, 1, 2].map((index) => (
          <Skeleton
            key={index}
            className="h-[156px] w-[104px] rounded-[10px]"
          />
        ))}
      </View>
    );
  }
  if (isError) {
    return (
      <SectionError
        message="Não foi possível carregar seus filmes."
        onRetry={() => void refetch()}
      />
    );
  }
  if (data.items.length === 0) {
    return (
      <View className="gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
        <Text className="font-semibold text-sm text-primary-text-color">
          Nenhum filme registrado ainda
        </Text>
        <Text className="font-sans text-caption text-tertiary-text-color">
          Toque no + para registrar o primeiro.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="-mx-5"
      contentContainerClassName="gap-3 px-5"
    >
      {data.items.map((movie) => (
        <RecentMovieCard key={movie.id} movie={movie} />
      ))}
    </ScrollView>
  );
}

export function RecentMovies() {
  return (
    <View className="gap-2.5">
      <SectionHeader
        title="Assistidos recentemente"
        linkLabel="Ver todos"
        href={ROUTES.movies}
      />
      <RecentMoviesBody />
    </View>
  );
}

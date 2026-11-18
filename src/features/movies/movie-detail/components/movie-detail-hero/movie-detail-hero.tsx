import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ChevronLeft, Ellipsis } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { IMovie } from '@/api/types';
import { Poster } from '@/components/poster';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';
import { formatRuntime } from '../../utils/movie-detail.utils';

const HERO_HEIGHT = 270;
const BLUR_RADIUS = 40;

export function goBackToMovies() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(ROUTES.movies);
  }
}

interface IMovieDetailHeroProps {
  movie: IMovie | undefined;
  onMoreOptions?: () => void;
}

function HeroButton({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="h-11 w-11 items-center justify-center rounded-xl bg-overlay-bg-color/70"
    >
      {children}
    </Pressable>
  );
}

export function MovieDetailHero({
  movie,
  onMoreOptions,
}: IMovieDetailHeroProps) {
  const scheme = useAppTheme();
  const insets = useSafeAreaInsets();
  const iconColor = color(scheme, 'primary-text-color');
  const meta = movie
    ? [
        String(movie.releaseYear),
        movie.durationMinutes
          ? formatRuntime(movie.durationMinutes)
          : undefined,
        movie.director,
      ].filter(Boolean)
    : [];

  return (
    <View
      className="justify-end overflow-hidden bg-tertiary-bg-color px-5 pb-[18px]"
      style={{ height: HERO_HEIGHT + insets.top }}
    >
      {movie?.posterUrl && (
        <Image
          source={{ uri: movie.posterUrl }}
          blurRadius={BLUR_RADIUS}
          contentFit="cover"
          style={{ position: 'absolute', inset: 0 }}
        />
      )}
      <View className="absolute inset-0 bg-overlay-bg-color/55" />

      <View
        className="absolute left-3 right-3 flex-row justify-between"
        style={{ top: insets.top + 8 }}
      >
        <HeroButton label="Back" onPress={goBackToMovies}>
          <ChevronLeft size={22} strokeWidth={2.4} color={iconColor} />
        </HeroButton>
        {onMoreOptions && (
          <HeroButton label="More options" onPress={onMoreOptions}>
            <Ellipsis size={20} color={iconColor} />
          </HeroButton>
        )}
      </View>

      {movie && (
        <View className="flex-row items-end gap-3.5">
          <Poster
            title={movie.title}
            posterUrl={movie.posterUrl}
            className="h-[138px] w-[92px] rounded-[10px]"
          />
          <View className="min-w-0 flex-1 pb-1">
            <Text
              accessibilityRole="header"
              numberOfLines={3}
              className="font-display text-[40px] leading-[40px] tracking-[1px] text-primary-text-color"
            >
              {movie.title}
            </Text>
            <Text className="mt-1.5 font-sans text-[13px] text-secondary-text-color">
              {meta.join(' · ')}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

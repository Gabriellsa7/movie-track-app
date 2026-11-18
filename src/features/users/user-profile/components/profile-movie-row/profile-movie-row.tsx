import { Link } from 'expo-router';
import { Star } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import type { IMovie } from '@/api/types';
import { Poster } from '@/components/poster';
import { formatRating } from '@/lib/rating';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n';

export function ProfileMovieRow({ movie }: { movie: IMovie }) {
  const { t } = useTranslation();
  const language = useLanguage();
  const scheme = useAppTheme();

  return (
    <Link
      href={{
        pathname: '/users/[userId]/movies/[movieId]',
        params: { userId: movie.userId, movieId: movie.id },
      }}
      asChild
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={t('users.profile.movieLabel', {
          title: movie.title,
          rating: formatRating(movie.rating, language),
        })}
        className="flex-row gap-3 rounded-xl border border-primary-border-color bg-secondary-bg-color p-2.5 active:opacity-80"
      >
        <Poster
          title={movie.title}
          posterUrl={movie.posterUrl}
          showTitle={false}
          className="h-[78px] w-[52px] rounded-md"
        />
        <View className="min-w-0 flex-1 gap-1">
          <View className="flex-row justify-between gap-2">
            <Text
              numberOfLines={1}
              className="flex-1 font-semibold text-[15px] text-primary-text-color"
            >
              {movie.title}
            </Text>
            <View className="flex-row items-center gap-1">
              <Star
                size={12}
                fill={color(scheme, 'star-filled-color')}
                color={color(scheme, 'star-filled-color')}
              />
              <Text className="font-semibold text-[13px] text-primary-text-color">
                {formatRating(movie.rating, language)}
              </Text>
            </View>
          </View>
          {movie.review ? (
            <Text
              numberOfLines={2}
              className="font-sans text-[13px] leading-[19px] text-secondary-text-color"
            >
              {movie.review}
            </Text>
          ) : (
            <Text className="font-sans text-[13px] text-tertiary-text-color">
              {t('users.profile.noReview')}
            </Text>
          )}
        </View>
      </Pressable>
    </Link>
  );
}

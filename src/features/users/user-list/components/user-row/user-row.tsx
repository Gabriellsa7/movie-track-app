import { Link } from 'expo-router';
import { Star } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import type { IUserSummary } from '@/api/types';
import { UserAvatar } from '@/components/user-avatar';
import { formatAverage } from '@/lib/stats';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { formatMoviesCount, formatSince } from '@/lib/users';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n';

export function UserRow({ user }: { user: IUserSummary }) {
  const { t } = useTranslation();
  const language = useLanguage();
  const scheme = useAppTheme();
  const details = t('users.since', {
    movies: formatMoviesCount(user.moviesCount, language),
    date: formatSince(user.memberSince, language),
  });

  return (
    <Link
      href={{ pathname: '/users/[userId]', params: { userId: user.id } }}
      asChild
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={
          user.averageRating === null
            ? t('users.rowLabel', { name: user.name, details })
            : t('users.rowLabelWithRating', {
                name: user.name,
                details,
                rating: formatAverage(user.averageRating, language),
              })
        }
        className="flex-row items-center gap-3 px-3.5 py-3 active:opacity-80"
      >
        <UserAvatar
          id={user.id}
          name={user.name}
          avatarUrl={user.avatarUrl}
          size={44}
        />
        <View className="min-w-0 flex-1 gap-0.5">
          <Text
            numberOfLines={1}
            className="font-semibold text-[15px] text-primary-text-color"
          >
            {user.name}
          </Text>
          <Text className="font-sans text-xs text-tertiary-text-color">
            {details}
          </Text>
        </View>
        {user.averageRating !== null && (
          <View className="flex-row items-center gap-1">
            <Star
              size={13}
              fill={color(scheme, 'star-filled-color')}
              color={color(scheme, 'star-filled-color')}
            />
            <Text className="font-semibold text-sm text-primary-text-color">
              {formatAverage(user.averageRating, language)}
            </Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

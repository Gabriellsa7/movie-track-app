import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import type { IUserProfile } from '@/api/types';
import { UserAvatar } from '@/components/user-avatar';
import { formatWatchedDate } from '@/lib/movie-format';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n';

interface IReviewAuthorProps {
  author: IUserProfile;
  watchedAt: string;
}

export function ReviewAuthor({ author, watchedAt }: IReviewAuthorProps) {
  const { t } = useTranslation();
  const language = useLanguage();
  return (
    <Link
      href={{ pathname: '/users/[userId]', params: { userId: author.id } }}
      asChild
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={t('users.review.authorLabel', {
          name: author.name,
          date: formatWatchedDate(watchedAt, language),
        })}
        className="flex-row items-center gap-3 self-start active:opacity-80"
      >
        <UserAvatar
          id={author.id}
          name={author.name}
          avatarUrl={author.avatarUrl}
          size={44}
        />
        <View>
          <Text className="font-semibold text-[15px] text-primary-text-color">
            {author.name}
          </Text>
          <Text className="font-sans text-xs text-tertiary-text-color">
            {t('users.review.watchedOn', {
              date: formatWatchedDate(watchedAt, language),
            })}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import type { IUserProfile } from '@/api/types';
import { UserAvatar } from '@/components/user-avatar';
import { formatWatchedDate } from '@/lib/movie-format';

interface IReviewAuthorProps {
  author: IUserProfile;
  watchedAt: string;
}

export function ReviewAuthor({ author, watchedAt }: IReviewAuthorProps) {
  return (
    <Link
      href={{ pathname: '/users/[userId]', params: { userId: author.id } }}
      asChild
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`${author.name}, watched on ${formatWatchedDate(watchedAt)}`}
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
            watched on {formatWatchedDate(watchedAt)}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

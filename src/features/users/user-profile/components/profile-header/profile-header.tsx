import { Text, View } from 'react-native';
import type { IUserProfile } from '@/api/types';
import { UserAvatar } from '@/components/user-avatar';
import { formatMemberSince } from '@/lib/users';
import { useLanguage } from '@/i18n';

export function ProfileHeader({ user }: { user: IUserProfile }) {
  const language = useLanguage();
  return (
    <View className="items-center gap-2">
      <UserAvatar
        id={user.id}
        name={user.name}
        avatarUrl={user.avatarUrl}
        size={88}
      />
      <Text
        accessibilityRole="header"
        className="mt-1 text-center font-display text-[40px] leading-[40px] tracking-[1px] text-primary-text-color"
      >
        {user.name}
      </Text>
      <Text className="font-sans text-[13px] text-tertiary-text-color">
        {formatMemberSince(user.memberSince, language)}
      </Text>
    </View>
  );
}

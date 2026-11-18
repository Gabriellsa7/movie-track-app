import { Pencil } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import type { IUser } from '@/api/types';
import { UserAvatar } from '@/components/user-avatar';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

interface IAccountHeaderProps {
  user: IUser;
  isSavingPhoto: boolean;
  onEditPhoto: () => void;
}

export function AccountHeader({
  user,
  isSavingPhoto,
  onEditPhoto,
}: IAccountHeaderProps) {
  const scheme = useAppTheme();

  return (
    <View className="flex-row items-center gap-3.5">
      <View className={isSavingPhoto ? 'opacity-60' : ''}>
        <UserAvatar
          id={user.id}
          name={user.name}
          avatarUrl={user.avatarUrl}
          size={64}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change photo"
          accessibilityState={{ disabled: isSavingPhoto }}
          disabled={isSavingPhoto}
          onPress={onEditPhoto}
          className="absolute -bottom-1 -right-1 h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-primary-bg-color bg-accent-bg-color"
        >
          <Pencil
            size={14}
            strokeWidth={2.4}
            color={color(scheme, 'on-accent-text-color')}
          />
        </Pressable>
      </View>
      <View className="min-w-0 flex-1">
        <Text
          numberOfLines={1}
          className="font-semibold text-[17px] text-primary-text-color"
        >
          {user.name}
        </Text>
        <Text
          numberOfLines={1}
          className="mt-0.5 font-sans text-[13px] text-tertiary-text-color"
        >
          {user.email}
        </Text>
      </View>
    </View>
  );
}

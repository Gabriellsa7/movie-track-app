import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { avatarToneOf, initialsOf } from '@/lib/users';

interface IUserAvatarProps {
  id: string;
  name: string;
  avatarUrl?: string;
  size: number;
}

export function UserAvatar({ id, name, avatarUrl, size }: IUserAvatarProps) {
  const tone = avatarToneOf(id);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={`items-center justify-center overflow-hidden rounded-full ${tone.bg}`}
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          contentFit="cover"
          style={{ width: size, height: size }}
        />
      ) : (
        <Text
          className={`font-display ${tone.text}`}
          style={{ fontSize: size * 0.45, lineHeight: size * 0.5 }}
        >
          {initialsOf(name)}
        </Text>
      )}
    </View>
  );
}

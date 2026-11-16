import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { ROUTES } from '@/routes/routes.constants';
import { useSessionStore } from '@/stores/session.store';
import { greetingFor } from '../../utils/home.utils';

export function HomeHeader() {
  const user = useSessionStore((state) => state.user);
  const initial = user?.name.trim().charAt(0).toUpperCase() ?? '';

  return (
    <View className="flex-row items-center justify-between">
      <View>
        <Text className="font-sans text-caption text-tertiary-text-color">
          {greetingFor(new Date(), user?.name)}
        </Text>
        <Text
          accessibilityRole="header"
          className="mt-0.5 font-display text-title-sm text-primary-text-color"
        >
          Início
        </Text>
      </View>
      <Link href={ROUTES.account} asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir conta"
          className="h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-secondary-border-color"
        >
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              contentFit="cover"
              style={{ width: 44, height: 44 }}
            />
          ) : (
            <Text className="font-semibold text-heading text-primary-text-color">
              {initial}
            </Text>
          )}
        </Pressable>
      </Link>
    </View>
  );
}

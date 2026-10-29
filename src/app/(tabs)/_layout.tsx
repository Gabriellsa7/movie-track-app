import { Tabs } from 'expo-router/js-tabs';
import {
  Bookmark,
  CircleUser,
  Film,
  House,
  Users,
  type LucideIcon,
} from 'lucide-react-native';
import type { ColorValue } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { rgb } from '@/theme/palette';

function tabIcon(Icon: LucideIcon) {
  return function TabIcon({
    color,
    size,
  }: {
    color: ColorValue;
    size: number;
  }) {
    // The tint colors set below are plain strings.
    return (
      <Icon
        color={typeof color === 'string' ? color : undefined}
        size={size}
        strokeWidth={2}
      />
    );
  };
}

export default function TabsLayout() {
  const scheme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: rgb(scheme, 'accent-bg-color'),
        tabBarInactiveTintColor: rgb(scheme, 'tertiary-text-color'),
        tabBarStyle: {
          backgroundColor: rgb(scheme, 'sidebar-bg-color'),
          borderTopColor: rgb(scheme, 'primary-border-color'),
        },
        tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Início', tabBarIcon: tabIcon(House) }}
      />
      <Tabs.Screen
        name="movies"
        options={{ title: 'Meus filmes', tabBarIcon: tabIcon(Film) }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{ title: 'Quero ver', tabBarIcon: tabIcon(Bookmark) }}
      />
      <Tabs.Screen
        name="users"
        options={{ title: 'Usuários', tabBarIcon: tabIcon(Users) }}
      />
      <Tabs.Screen
        name="account"
        options={{ title: 'Conta', tabBarIcon: tabIcon(CircleUser) }}
      />
    </Tabs>
  );
}

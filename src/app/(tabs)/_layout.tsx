import { Tabs } from 'expo-router/js-tabs';
import {
  Bookmark,
  CircleUser,
  Film,
  House,
  Users,
  type LucideIcon,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { ColorValue } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

function tabIcon(Icon: LucideIcon) {
  return function TabIcon({
    color,
    size,
  }: {
    color: ColorValue;
    size: number;
  }) {
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
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color(scheme, 'accent-bg-color'),
        tabBarInactiveTintColor: color(scheme, 'tertiary-text-color'),
        tabBarStyle: {
          backgroundColor: color(scheme, 'sidebar-bg-color'),
          borderTopColor: color(scheme, 'primary-border-color'),
        },
        tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t('navigation.home'), tabBarIcon: tabIcon(House) }}
      />
      <Tabs.Screen
        name="movies"
        options={{ title: t('navigation.movies'), tabBarIcon: tabIcon(Film) }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: t('navigation.watchlist'),
          tabBarIcon: tabIcon(Bookmark),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{ title: t('navigation.users'), tabBarIcon: tabIcon(Users) }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('navigation.account'),
          tabBarIcon: tabIcon(CircleUser),
        }}
      />
    </Tabs>
  );
}

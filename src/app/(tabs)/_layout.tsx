import { Tabs } from 'expo-router/js-tabs';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { rgb } from '@/theme/palette';

export default function TabsLayout() {
  const scheme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: rgb(scheme, 'accent'),
        tabBarInactiveTintColor: rgb(scheme, 'text-muted'),
        tabBarStyle: {
          backgroundColor: rgb(scheme, 'sidebar'),
          borderTopColor: rgb(scheme, 'border'),
        },
        tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="movies" options={{ title: 'Meus filmes' }} />
      <Tabs.Screen name="watchlist" options={{ title: 'Quero ver' }} />
      <Tabs.Screen name="users" options={{ title: 'Usuários' }} />
      <Tabs.Screen name="account" options={{ title: 'Conta' }} />
    </Tabs>
  );
}

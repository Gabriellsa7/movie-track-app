import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { queryKeys } from '@/api/query-keys';
import { useUserStatsQuery } from '@/api/get-user-stats';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { useSessionStore } from '@/stores/session.store';
import { color } from '@/theme/palette';
import { HomeHeader } from './components/home-header/home-header';
import { MoviesPerMonth } from './components/movies-per-month/movies-per-month';
import { NextMovie } from './components/next-movie/next-movie';
import { RecentMovies } from './components/recent-movies/recent-movies';
import { SectionError } from './components/section-error/section-error';
import { StatsGrid } from './components/stats-grid/stats-grid';

export function HomeScreen() {
  const scheme = useAppTheme();
  const client = useQueryClient();
  const userId = useSessionStore((state) => state.userId) ?? '';
  const stats = useUserStatsQuery(userId);
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    await Promise.all([
      client.invalidateQueries({ queryKey: queryKeys.users.stats(userId) }),
      client.invalidateQueries({ queryKey: queryKeys.movies.all }),
      client.invalidateQueries({ queryKey: queryKeys.watchlist.all }),
    ]);
    setRefreshing(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color" edges={['top']}>
      <ScrollView
        testID="home-scroll"
        contentContainerClassName="gap-6 px-5 pb-28 pt-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refresh()}
            tintColor={color(scheme, 'accent-bg-color')}
            colors={[color(scheme, 'accent-bg-color')]}
          />
        }
      >
        <HomeHeader />
        {stats.isError ? (
          <SectionError
            message="Não foi possível carregar suas estatísticas."
            onRetry={() => void stats.refetch()}
          />
        ) : (
          <StatsGrid stats={stats.data} />
        )}
        <NextMovie />
        <RecentMovies />
        {stats.isError ? null : <MoviesPerMonth stats={stats.data} />}
      </ScrollView>

      <View className="absolute bottom-5 right-5">
        <Link href={ROUTES.newMovie} asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Registrar filme"
            className="h-14 w-14 items-center justify-center rounded-2xl bg-accent-bg-color shadow-lg shadow-black/45"
          >
            <Plus
              size={26}
              strokeWidth={2.4}
              color={color(scheme, 'on-accent-text-color')}
            />
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

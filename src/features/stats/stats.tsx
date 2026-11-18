import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStatsQuery } from '@/api/get-user-stats';
import { NewMovieButton } from '@/components/new-movie-button';
import { SectionError } from '@/components/section-error';
import { useSessionStore } from '@/stores/session.store';
import { useRefreshControl } from '@/lib/use-refresh-control';
import { Dashboard } from './components/dashboard/dashboard';
import { StatsHeader } from './components/stats-header/stats-header';
import { StatsSkeleton } from './components/stats-skeleton/stats-skeleton';
import { useTranslation } from 'react-i18next';

export function StatsScreen() {
  const { t } = useTranslation();
  const userId = useSessionStore((state) => state.userId) ?? '';
  const stats = useUserStatsQuery(userId);
  const refreshControl = useRefreshControl(() => stats.refetch());

  function renderBody() {
    if (stats.isPending) {
      return <StatsSkeleton />;
    }
    if (stats.isError) {
      return (
        <SectionError
          message={t('stats.loadFailed')}
          onRetry={() => void stats.refetch()}
        />
      );
    }
    if (stats.data.totalMovies === 0) {
      return (
        <View className="gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
          <Text className="font-semibold text-sm text-primary-text-color">
            {t('stats.emptyTitle')}
          </Text>
          <Text className="font-sans text-caption text-tertiary-text-color">
            {t('stats.emptyBody')}
          </Text>
        </View>
      );
    }
    return <Dashboard stats={stats.data} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color" edges={['top']}>
      <ScrollView
        contentContainerClassName="gap-5 px-5 pb-28 pt-2"
        refreshControl={refreshControl}
      >
        <StatsHeader />
        {renderBody()}
      </ScrollView>
      <NewMovieButton />
    </SafeAreaView>
  );
}

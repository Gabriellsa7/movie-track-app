import { Link } from 'expo-router';
import { ChartColumn, ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import type { IUserStats } from '@/api/types';
import { SectionError } from '@/components/section-error';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';
import { SectionHeader } from '../section-header/section-header';
import { StatsGrid } from '../stats-grid/stats-grid';
import { useTranslation } from 'react-i18next';

interface IStatsOverviewProps {
  stats: IUserStats | undefined;
  isError: boolean;
  onRetry: () => void;
}

export function StatsOverview({
  stats,
  isError,
  onRetry,
}: IStatsOverviewProps) {
  const { t } = useTranslation();
  const scheme = useAppTheme();

  return (
    <View className="gap-2.5">
      <SectionHeader
        title={t('home.stats.title')}
        linkLabel={t('home.stats.seeDashboard')}
        href={ROUTES.stats}
      />
      {isError ? (
        <SectionError message={t('home.stats.loadFailed')} onRetry={onRetry} />
      ) : (
        <Link href={ROUTES.stats} asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={t('home.stats.openDashboard')}
            accessibilityHint={t('home.stats.openDashboardHint')}
            className="gap-2.5 active:opacity-80"
          >
            <StatsGrid stats={stats} />
            <View className="flex-row items-center gap-2 rounded-[14px] border border-accent-border-color bg-accent-soft-bg-color px-3.5 py-3">
              <ChartColumn
                size={18}
                color={color(scheme, 'accent-text-color')}
              />
              <Text className="flex-1 font-sans text-caption text-secondary-text-color">
                {t('home.stats.dashboardTip')}
              </Text>
              <ChevronRight
                size={18}
                color={color(scheme, 'accent-text-color')}
              />
            </View>
          </Pressable>
        </Link>
      )}
    </View>
  );
}

import { View } from 'react-native';
import { ROUTES } from '@/routes/routes.constants';
import { SectionHeader } from '../section-header/section-header';
import { RecentMoviesBody } from '../recent-movies-body/recent-movies-body';
import { useTranslation } from 'react-i18next';

export function RecentMovies() {
  const { t } = useTranslation();
  return (
    <View className="gap-2.5">
      <SectionHeader
        title={t('home.recent.title')}
        linkLabel={t('home.recent.seeAll')}
        href={ROUTES.movies}
      />
      <RecentMoviesBody />
    </View>
  );
}

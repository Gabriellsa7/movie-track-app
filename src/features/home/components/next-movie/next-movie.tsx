import { View } from 'react-native';
import { ROUTES } from '@/routes/routes.constants';
import { SectionHeader } from '../section-header/section-header';
import { NextMovieBody } from '../next-movie-body/next-movie-body';
import { useTranslation } from 'react-i18next';

export function NextMovie() {
  const { t } = useTranslation();
  return (
    <View className="gap-2.5">
      <SectionHeader
        title={t('home.next.title')}
        linkLabel={t('home.next.seeList')}
        href={ROUTES.watchlist}
      />
      <NextMovieBody />
    </View>
  );
}

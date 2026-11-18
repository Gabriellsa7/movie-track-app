import { View } from 'react-native';
import { ROUTES } from '@/routes/routes.constants';
import { SectionHeader } from '../section-header/section-header';
import { RecentMoviesBody } from '../recent-movies-body/recent-movies-body';

export function RecentMovies() {
  return (
    <View className="gap-2.5">
      <SectionHeader
        title="Recently watched"
        linkLabel="See all"
        href={ROUTES.movies}
      />
      <RecentMoviesBody />
    </View>
  );
}

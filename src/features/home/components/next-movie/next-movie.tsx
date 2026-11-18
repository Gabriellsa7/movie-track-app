import { View } from 'react-native';
import { ROUTES } from '@/routes/routes.constants';
import { SectionHeader } from '../section-header/section-header';
import { NextMovieBody } from '../next-movie-body/next-movie-body';

export function NextMovie() {
  return (
    <View className="gap-2.5">
      <SectionHeader
        title="Next movie"
        linkLabel="See list"
        href={ROUTES.watchlist}
      />
      <NextMovieBody />
    </View>
  );
}

import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';

const LOAD_MORE_THRESHOLD = 0.5;

interface IPagedQuery {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => Promise<unknown>;
}

export function useLoadMore(query: IPagedQuery) {
  const scheme = useAppTheme();
  const { t } = useTranslation();

  function loadMore() {
    if (
      query.hasNextPage &&
      !query.isFetchingNextPage &&
      !query.isFetchNextPageError
    ) {
      void query.fetchNextPage();
    }
  }

  function renderFooter() {
    if (query.isFetchingNextPage) {
      return (
        <View className="items-center py-4">
          <ActivityIndicator
            accessibilityLabel={t('common.loadingMore')}
            color={color(scheme, 'accent-text-color')}
          />
        </View>
      );
    }
    if (query.isFetchNextPageError) {
      return (
        <Pressable
          accessibilityRole="button"
          onPress={() => void query.fetchNextPage()}
          className="items-center py-4"
        >
          <Text className="font-semibold text-sm text-accent-text-color">
            {t('common.couldntLoadMore')}
          </Text>
        </Pressable>
      );
    }
    return undefined;
  }

  return {
    onEndReached: loadMore,
    onEndReachedThreshold: LOAD_MORE_THRESHOLD,
    ListFooterComponent: renderFooter(),
  };
}

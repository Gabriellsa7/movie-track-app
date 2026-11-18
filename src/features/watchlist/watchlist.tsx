import { Pencil, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWatchlistPagesQuery } from '@/api/get-watchlist';
import { pagesItems } from '@/api/pagination';
import type { IListWatchlistQuery, IWatchlistItem } from '@/api/types';
import { ActionSheet } from '@/components/action-sheet';
import { FloatingAddButton } from '@/components/floating-add-button';
import { SectionError } from '@/components/section-error';
import { useLoadMore } from '@/lib/use-load-more';
import { useRefreshControl } from '@/lib/use-refresh-control';
import { ROUTES } from '@/routes/routes.constants';
import { WatchlistEmpty } from './components/watchlist-empty/watchlist-empty';
import { WatchlistHeader } from './components/watchlist-header/watchlist-header';
import { WatchlistItemCard } from './components/watchlist-item-card/watchlist-item-card';
import { WatchlistItemCardSkeleton } from './components/watchlist-item-card-skeleton/watchlist-item-card-skeleton';
import {
  WatchlistTabs,
  type TWatchlistTab,
} from './components/watchlist-tabs/watchlist-tabs';
import { useWatchlistItemActions } from './hooks/use-watchlist-item-actions';
import { useTranslation } from 'react-i18next';

export const UPCOMING_QUERY: IListWatchlistQuery = {
  planned: true,
  sort: 'plannedFor',
};
export const SOMEDAY_QUERY: IListWatchlistQuery = {
  planned: false,
  sort: 'priority',
};
const SKELETON_ROWS = [0, 1, 2];

export function WatchlistScreen() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TWatchlistTab>('upcoming');
  const upcoming = useWatchlistPagesQuery(UPCOMING_QUERY);
  const someday = useWatchlistPagesQuery(SOMEDAY_QUERY);
  const active = tab === 'upcoming' ? upcoming : someday;
  const loadMore = useLoadMore(active);
  const { edit, remove } = useWatchlistItemActions();
  const [menuItem, setMenuItem] = useState<IWatchlistItem | null>(null);
  const refreshControl = useRefreshControl(() =>
    Promise.all([upcoming.refetch(), someday.refetch()]),
  );

  function renderEmpty() {
    if (active.isPending) {
      return (
        <View className="gap-2.5">
          {SKELETON_ROWS.map((row) => (
            <WatchlistItemCardSkeleton key={row} />
          ))}
        </View>
      );
    }
    if (active.isError) {
      return (
        <SectionError
          message={t('watchlist.loadFailed')}
          onRetry={() => void active.refetch()}
        />
      );
    }
    return <WatchlistEmpty tab={tab} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color" edges={['top']}>
      <FlatList
        data={pagesItems(active.data)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WatchlistItemCard item={item} onMoreOptions={setMenuItem} />
        )}
        ListHeaderComponent={
          <View className="gap-4 pb-4">
            <WatchlistHeader />
            <WatchlistTabs
              active={tab}
              upcomingCount={upcoming.data?.pages[0]?.total}
              somedayCount={someday.data?.pages[0]?.total}
              onChange={setTab}
            />
          </View>
        }
        ListEmptyComponent={renderEmpty()}
        ItemSeparatorComponent={() => <View className="h-2.5" />}
        contentContainerClassName="px-5 pb-28 pt-4"
        refreshControl={refreshControl}
        {...loadMore}
      />
      <ActionSheet
        title={menuItem?.title ?? ''}
        visible={menuItem !== null}
        onClose={() => {
          setMenuItem(null);
        }}
        actions={
          menuItem
            ? [
                {
                  label: t('watchlist.edit'),
                  icon: Pencil,
                  onPress: () => {
                    edit(menuItem);
                  },
                },
                {
                  label: t('watchlist.remove'),
                  icon: Trash2,
                  destructive: true,
                  onPress: () => {
                    remove(menuItem);
                  },
                },
              ]
            : []
        }
      />
      <FloatingAddButton
        href={ROUTES.newWatchlistItem}
        label={t('watchlist.add')}
      />
    </SafeAreaView>
  );
}

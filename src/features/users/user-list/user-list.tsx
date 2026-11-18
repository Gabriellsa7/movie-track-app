import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchField } from '@/components/search-field';
import { SectionError } from '@/components/section-error';
import { useDebouncedValue } from '@/lib/use-debounced-value';
import { useRefreshControl } from '@/lib/use-refresh-control';
import { useSessionStore } from '@/stores/session.store';
import { useUsersQuery } from '../api/get-users';
import { UserRow } from './components/user-row/user-row';
import { UserRowSkeleton } from './components/user-row-skeleton/user-row-skeleton';
import { UsersEmpty } from './components/users-empty/users-empty';

const SEARCH_DEBOUNCE_MILLISECONDS = 300;
const USERS_PER_PAGE = 50;
const SKELETON_ROWS = [0, 1, 2, 3, 4];

export function UsersScreen() {
  const myUserId = useSessionStore((state) => state.userId);
  const [searchText, setSearchText] = useState('');
  const search = useDebouncedValue(
    searchText.trim(),
    SEARCH_DEBOUNCE_MILLISECONDS,
  );
  const { data, isPending, isError, refetch } = useUsersQuery({
    limit: USERS_PER_PAGE,
    ...(search && { search }),
  });
  const refreshControl = useRefreshControl(() => refetch());
  const users = data?.items.filter((user) => user.id !== myUserId);

  function renderEmpty() {
    if (isPending) {
      return (
        <View className="overflow-hidden rounded-[14px] border border-primary-border-color bg-secondary-bg-color">
          {SKELETON_ROWS.map((row) => (
            <UserRowSkeleton key={row} />
          ))}
        </View>
      );
    }
    if (isError) {
      return (
        <SectionError
          message="Couldn't load the users."
          onRetry={() => void refetch()}
        />
      );
    }
    return <UsersEmpty search={search} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color" edges={['top']}>
      <FlatList
        data={users}
        keyExtractor={(user) => user.id}
        renderItem={({ item, index }) => (
          <View
            className={`border-x border-primary-border-color bg-secondary-bg-color ${
              index === 0 ? 'rounded-t-[14px] border-t' : ''
            } ${
              index === (users?.length ?? 0) - 1
                ? 'rounded-b-[14px] border-b'
                : 'border-b'
            }`}
          >
            <UserRow user={item} />
          </View>
        )}
        ListHeaderComponent={
          <View className="gap-4 pb-4">
            <View className="gap-1">
              <Text
                accessibilityRole="header"
                className="font-display text-title-sm tracking-[1px] text-primary-text-color"
              >
                Users
              </Text>
              <Text className="font-sans text-caption text-tertiary-text-color">
                See what other people are watching
              </Text>
            </View>
            <SearchField
              label="Search by name"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        }
        ListEmptyComponent={renderEmpty()}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerClassName="px-5 pb-10 pt-4"
        refreshControl={refreshControl}
      />
    </SafeAreaView>
  );
}

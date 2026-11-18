import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionError } from '@/components/section-error';
import { Skeleton } from '@/components/skeleton';
import { useWatchlistItemQuery } from '../api/get-watchlist-item';
import {
  closeWatched,
  WatchedForm,
} from './components/watched-form/watched-form';
import { WatchedHeader } from './components/watched-header/watched-header';
import { useTranslation } from 'react-i18next';

export function WatchlistWatchedScreen() {
  const { t } = useTranslation();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const item = useWatchlistItemQuery(itemId);

  function renderBody() {
    if (item.data) {
      return <WatchedForm item={item.data} />;
    }
    return (
      <View className="gap-4 px-5 pt-3">
        {item.isPending ? (
          <Skeleton className="h-[66px] rounded-xl" />
        ) : item.isError ? (
          <SectionError
            message={t('watchlist.form.loadFailed')}
            onRetry={() => void item.refetch()}
          />
        ) : (
          <>
            <WatchedHeader
              title={t('watchlist.watched.notFound')}
              posterUrl={undefined}
              onClose={closeWatched}
            />
            <Text className="font-sans text-base text-secondary-text-color">
              {t('watchlist.form.notFound')}
            </Text>
          </>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-secondary-bg-color">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {renderBody()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

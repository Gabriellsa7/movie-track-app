import { useState } from 'react';
import { RefreshControl } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

export function useRefreshControl(refresh: () => Promise<unknown>) {
  const scheme = useAppTheme();
  const [refreshing, setRefreshing] = useState(false);

  function onRefresh() {
    setRefreshing(true);
    void refresh().finally(() => {
      setRefreshing(false);
    });
  }

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={color(scheme, 'accent-bg-color')}
      colors={[color(scheme, 'accent-bg-color')]}
    />
  );
}

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import Constants from 'expo-constants';
import type { ReactNode } from 'react';
import { queryPersister } from '@/lib/react-query/persister';
import {
  CACHE_MAX_AGE_MILLISECONDS,
  queryClient,
} from '@/lib/react-query/query-client';

const persistOptions = {
  persister: queryPersister,
  maxAge: CACHE_MAX_AGE_MILLISECONDS,
  // A new app version drops the old cache, whose shape may have changed.
  buster: Constants.expoConfig?.version ?? 'dev',
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

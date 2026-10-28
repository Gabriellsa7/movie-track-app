import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { registerSessionHandlers } from '@/api/client';
import { queryClient } from '@/lib/react-query/query-client';
import { useSessionStore } from '@/stores/session.store';
import { mockApi } from './mock-api';
import { secureStoreValues } from './secure-store.mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('@react-native-community/netinfo', () =>
  jest.requireActual<object>(
    '@react-native-community/netinfo/jest/netinfo-mock.js',
  ),
);
jest.mock('expo-secure-store', () =>
  jest.requireActual<object>('./secure-store.mock'),
);
jest.mock('sonner-native', () => ({
  toast: Object.assign(jest.fn(), { error: jest.fn(), success: jest.fn() }),
  Toaster: () => null,
}));

const INITIAL_SESSION = useSessionStore.getState();

afterEach(() => {
  mockApi.reset();
  registerSessionHandlers(null);
  queryClient.clear();
  secureStoreValues.clear();
  useSessionStore.setState(INITIAL_SESSION, true);
});

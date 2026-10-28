import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager } from '@tanstack/react-query';
import { AppState } from 'react-native';
import { setUpReactQueryManagers } from './react-native-managers';

describe('When React Query runs on a phone', () => {
  it('should follow the connection and the app state', () => {
    const netInfoListener = jest.mocked(NetInfo.addEventListener);
    const appStateListener = jest.spyOn(AppState, 'addEventListener');

    const tearDown = setUpReactQueryManagers();
    onlineManager.subscribe(() => undefined)();
    const onConnection = netInfoListener.mock.calls.at(-1)?.[0];
    const onAppState = appStateListener.mock.calls.at(-1)?.[1];

    onConnection?.({ isConnected: false } as never);
    expect(onlineManager.isOnline()).toBe(false);
    onConnection?.({ isConnected: true } as never);
    expect(onlineManager.isOnline()).toBe(true);

    onAppState?.('background');
    expect(focusManager.isFocused()).toBe(false);
    onAppState?.('active');
    expect(focusManager.isFocused()).toBe(true);

    tearDown();
  });
});

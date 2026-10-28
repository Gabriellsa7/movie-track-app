import { act, fireEvent, render, screen } from '@testing-library/react-native';
import * as SplashScreen from 'expo-splash-screen';
import { AnimatedSplash } from './animated-splash';

jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(() => Promise.resolve()),
}));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('When the app is starting', () => {
  it('should swap the native splash for the animated logo', async () => {
    await render(<AnimatedSplash ready={false} onFinish={jest.fn()} />);

    const splash = screen.getByLabelText('Carregando o Movie Track');
    await fireEvent(splash, 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 844 } },
    });

    expect(SplashScreen.hideAsync).toHaveBeenCalled();
  });

  it('should keep the logo while the app is not ready', async () => {
    const onFinish = jest.fn();
    await render(<AnimatedSplash ready={false} onFinish={onFinish} />);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(3000);
    });

    expect(onFinish).not.toHaveBeenCalled();
  });

  it('should fade out once the app is ready', async () => {
    const onFinish = jest.fn();
    await render(<AnimatedSplash ready onFinish={onFinish} />);

    // First past the minimum time on screen, then through the fade.
    await act(async () => {
      await jest.advanceTimersByTimeAsync(600);
    });
    await act(async () => {
      await jest.advanceTimersByTimeAsync(1000);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});

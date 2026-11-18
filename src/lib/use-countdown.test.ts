import { act, renderHook } from '@testing-library/react-native';
import { formatCountdown, useCountdown } from './use-countdown';

describe('When we count down to a new try', () => {
  it('should format minutes and seconds', () => {
    expect(formatCountdown(42)).toBe('0:42');
    expect(formatCountdown(65)).toBe('1:05');
  });

  it('should tick once a second until zero', async () => {
    jest.useFakeTimers();
    const { result } = await renderHook(() => useCountdown());

    await act(() => {
      result.current.start(2);
    });
    await act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.secondsLeft).toBe(1);
    await act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.secondsLeft).toBe(0);
    jest.useRealTimers();
  });
});

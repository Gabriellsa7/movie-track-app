import { act, renderHook } from '@testing-library/react-native';
import { useDebouncedValue } from './use-debounced-value';

describe('When we debounce a value', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should only change after the value stops changing', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'd' } },
    );

    await rerender({ value: 'du' });
    await act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('d');

    await act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('du');
  });
});

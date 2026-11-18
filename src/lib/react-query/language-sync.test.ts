import { act } from '@testing-library/react-native';
import { queryClient } from '@/lib/react-query/query-client';
import { useLanguageStore } from '@/stores/language.store';
import { setUpLanguageSync } from './language-sync';

let stop: () => void;

beforeEach(() => {
  useLanguageStore.setState({ preference: 'en' });
  stop = setUpLanguageSync();
});

afterEach(async () => {
  stop();
  await act(() => {
    useLanguageStore.setState({ preference: 'en' });
  });
});

describe('When the app language changes', () => {
  it('should reload the data so genres and TMDB come in the new language', async () => {
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');

    await act(() => {
      useLanguageStore.setState({ preference: 'pt-BR' });
    });

    expect(invalidate).toHaveBeenCalledTimes(1);
    invalidate.mockRestore();
  });

  it('should not reload when the choice resolves to the same language', async () => {
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');

    await act(() => {
      useLanguageStore.setState({ preference: 'system' });
    });

    expect(invalidate).not.toHaveBeenCalled();
    invalidate.mockRestore();
  });
});

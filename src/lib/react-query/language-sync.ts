import { resolveLanguage } from '@/i18n';
import { useLanguageStore } from '@/stores/language.store';
import { queryClient } from './query-client';

export function setUpLanguageSync() {
  return useLanguageStore.subscribe((state, previous) => {
    if (
      resolveLanguage(state.preference) !== resolveLanguage(previous.preference)
    ) {
      void queryClient.invalidateQueries();
    }
  });
}

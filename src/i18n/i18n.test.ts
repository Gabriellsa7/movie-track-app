import { act } from '@testing-library/react-native';
import { useLanguageStore } from '@/stores/language.store';
import { i18n, resolveLanguage } from './index';
import { messageKey, translateMessage } from './message';

afterEach(async () => {
  await act(() => {
    useLanguageStore.setState({ preference: 'en' });
  });
});

describe('When we pick the app language', () => {
  it('should follow the device when the choice is system', () => {
    expect(resolveLanguage('system')).toBe('en');
    expect(resolveLanguage('pt-BR')).toBe('pt-BR');
  });

  it('should switch the texts when the choice changes', async () => {
    await act(() => {
      useLanguageStore.setState({ preference: 'pt-BR' });
    });

    expect(i18n.language).toBe('pt-BR');
    expect(i18n.t('navigation.watchlist')).toBe('Quero ver');
  });
});

describe('When we show a validation message', () => {
  it('should translate keys with their values', () => {
    expect(
      translateMessage(messageKey('validation.maxLength', { count: 200 })),
    ).toBe('Use at most 200 characters');
    expect(translateMessage('validation.email')).toBe('Enter a valid e-mail');
  });

  it('should keep messages that are not keys, like the ones from the API', () => {
    expect(translateMessage('Something the server said')).toBe(
      'Something the server said',
    );
  });
});

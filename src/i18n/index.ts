import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  useLanguageStore,
  type TLanguagePreference,
} from '@/stores/language.store';
import { RESOURCES } from './resources';

export type TLanguage = keyof typeof RESOURCES;

export const FALLBACK_LANGUAGE: TLanguage = 'en';

export function deviceLanguage(): TLanguage {
  return getLocales().at(0)?.languageCode === 'pt'
    ? 'pt-BR'
    : FALLBACK_LANGUAGE;
}

export function resolveLanguage(preference: TLanguagePreference): TLanguage {
  return preference === 'system' ? deviceLanguage() : preference;
}

export function currentLanguage(): TLanguage {
  return i18n.language === 'pt-BR' ? 'pt-BR' : FALLBACK_LANGUAGE;
}

void i18n.use(initReactI18next).init({
  resources: RESOURCES,
  lng: resolveLanguage(useLanguageStore.getState().preference),
  fallbackLng: FALLBACK_LANGUAGE,
  interpolation: { escapeValue: false },
  returnNull: false,
});

useLanguageStore.subscribe((state) => {
  void i18n.changeLanguage(resolveLanguage(state.preference));
});

export { i18n };

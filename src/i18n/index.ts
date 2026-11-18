import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
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

function toLanguage(language: string): TLanguage {
  return language === 'pt-BR' ? 'pt-BR' : FALLBACK_LANGUAGE;
}

export function currentLanguage(): TLanguage {
  return toLanguage(i18n.language);
}

export function useLanguage(): TLanguage {
  const { i18n: instance } = useTranslation();
  return toLanguage(instance.language);
}

export function tFor(language: TLanguage) {
  return i18n.getFixedT(language);
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

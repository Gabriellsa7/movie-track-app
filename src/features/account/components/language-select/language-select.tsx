import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/stores/language.store';
import { PreferenceSelect } from '../preference-select/preference-select';

export function LanguageSelect() {
  const { t } = useTranslation();
  const preference = useLanguageStore((state) => state.preference);
  const setPreference = useLanguageStore((state) => state.setPreference);

  return (
    <PreferenceSelect
      title={t('account.language.title')}
      label={t('account.language.title')}
      options={[
        { value: 'en', label: t('account.language.english') },
        { value: 'pt-BR', label: t('account.language.portuguese') },
        { value: 'system', label: t('account.language.system') },
      ]}
      value={preference}
      onChange={setPreference}
    />
  );
}

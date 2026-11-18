import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/stores/theme.store';
import { PreferenceSelect } from '../preference-select/preference-select';

export function ThemeSelect() {
  const { t } = useTranslation();
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);

  return (
    <PreferenceSelect
      title={t('account.appearance.title')}
      label={t('account.appearance.label')}
      options={[
        { value: 'dark', label: t('account.appearance.dark') },
        { value: 'light', label: t('account.appearance.light') },
        { value: 'system', label: t('account.appearance.system') },
      ]}
      value={preference}
      onChange={setPreference}
    />
  );
}

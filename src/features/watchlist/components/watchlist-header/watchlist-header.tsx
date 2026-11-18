import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export function WatchlistHeader() {
  const { t } = useTranslation();
  return (
    <Text
      accessibilityRole="header"
      className="font-display text-title-sm tracking-[1px] text-primary-text-color"
    >
      {t('watchlist.title')}
    </Text>
  );
}

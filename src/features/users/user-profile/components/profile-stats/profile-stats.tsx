import { Text, View } from 'react-native';
import type { IUserProfile } from '@/api/types';
import { formatAverage } from '@/lib/stats';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n';

interface IStatProps {
  value: string;
  label: string;
  accent?: boolean;
  divided?: boolean;
}

function Stat({ value, label, accent = false, divided = false }: IStatProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${value} ${label}`}
      className={`flex-1 items-center ${
        divided ? 'border-x border-primary-border-color' : ''
      }`}
    >
      <Text
        className={`font-display ${
          accent ? 'text-accent-text-color' : 'text-primary-text-color'
        }`}
        style={{ fontSize: 30, lineHeight: 32 }}
      >
        {value}
      </Text>
      <Text className="font-sans text-xs text-tertiary-text-color">
        {label}
      </Text>
    </View>
  );
}

export function ProfileStats({ user }: { user: IUserProfile }) {
  const { t } = useTranslation();
  const language = useLanguage();
  return (
    <View className="flex-row rounded-[14px] border border-primary-border-color bg-secondary-bg-color py-3.5">
      <Stat
        value={String(user.moviesCount)}
        label={t('users.profile.statMovies', { count: user.moviesCount })}
      />
      <Stat
        value={formatAverage(user.averageRating, language)}
        label={t('users.profile.statAverage')}
        accent
        divided
      />
      <Stat
        value={String(user.favoritesCount)}
        label={t('users.profile.statFavorites', {
          count: user.favoritesCount,
        })}
      />
    </View>
  );
}

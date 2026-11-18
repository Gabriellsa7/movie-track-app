import { Text, View } from 'react-native';
import type { IUserProfile } from '@/api/types';
import { formatAverage } from '@/lib/stats';

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
  return (
    <View className="flex-row rounded-[14px] border border-primary-border-color bg-secondary-bg-color py-3.5">
      <Stat
        value={String(user.moviesCount)}
        label={user.moviesCount === 1 ? 'movie' : 'movies'}
      />
      <Stat
        value={formatAverage(user.averageRating)}
        label="average rating"
        accent
        divided
      />
      <Stat
        value={String(user.favoritesCount)}
        label={user.favoritesCount === 1 ? 'favorite' : 'favorites'}
      />
    </View>
  );
}

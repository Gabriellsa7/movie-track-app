import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export function UsersEmpty({ search }: { search: string }) {
  const { t } = useTranslation();
  return (
    <View className="gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
      <Text className="font-semibold text-sm text-primary-text-color">
        {search
          ? t('users.empty.searchTitle', { search })
          : t('users.empty.title')}
      </Text>
      <Text className="font-sans text-caption text-tertiary-text-color">
        {search ? t('users.empty.searchHint') : t('users.empty.hint')}
      </Text>
    </View>
  );
}

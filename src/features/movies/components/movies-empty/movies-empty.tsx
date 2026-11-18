import { Text, View } from 'react-native';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

interface IMoviesEmptyProps {
  search: string;
  filtered: boolean;
}

function messages(
  t: TFunction,
  search: string,
  filtered: boolean,
): [string, string] {
  if (search) {
    return [
      t('movies.empty.searchTitle', { search }),
      t('movies.empty.searchHint'),
    ];
  }
  if (filtered) {
    return [t('movies.empty.filteredTitle'), t('movies.empty.filteredHint')];
  }
  return [t('movies.empty.title'), t('movies.empty.hint')];
}

export function MoviesEmpty({ search, filtered }: IMoviesEmptyProps) {
  const { t } = useTranslation();
  const [title, hint] = messages(t, search, filtered);

  return (
    <View className="gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
      <Text className="font-semibold text-sm text-primary-text-color">
        {title}
      </Text>
      <Text className="font-sans text-caption text-tertiary-text-color">
        {hint}
      </Text>
    </View>
  );
}

import { Text, View } from 'react-native';

interface IMoviesEmptyProps {
  search: string;
  filtered: boolean;
}

function messages(search: string, filtered: boolean): [string, string] {
  if (search) {
    return [
      `No movies found for “${search}”`,
      'Check the title or try another search.',
    ];
  }
  if (filtered) {
    return ['No movies match these filters', 'Try other filters.'];
  }
  return ['No movies logged yet', 'Tap + to log your first one.'];
}

export function MoviesEmpty({ search, filtered }: IMoviesEmptyProps) {
  const [title, hint] = messages(search, filtered);

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

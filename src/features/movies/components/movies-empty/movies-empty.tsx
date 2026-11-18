import { Text, View } from 'react-native';

interface IMoviesEmptyProps {
  search: string;
}

export function MoviesEmpty({ search }: IMoviesEmptyProps) {
  return (
    <View className="gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
      <Text className="font-semibold text-sm text-primary-text-color">
        {search ? `No movies found for “${search}”` : 'No movies logged yet'}
      </Text>
      <Text className="font-sans text-caption text-tertiary-text-color">
        {search
          ? 'Check the title or try another search.'
          : 'Tap + to log your first one.'}
      </Text>
    </View>
  );
}

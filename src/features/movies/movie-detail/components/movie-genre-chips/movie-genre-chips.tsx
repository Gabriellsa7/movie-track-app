import { Text, View } from 'react-native';

export function MovieGenreChips({ names }: { names: string[] }) {
  if (names.length === 0) {
    return null;
  }

  return (
    <View className="flex-row flex-wrap gap-1.5">
      {names.map((name) => (
        <View
          key={name}
          className="h-[26px] justify-center rounded-full bg-tertiary-bg-color px-2.5"
        >
          <Text className="font-sans text-xs text-primary-text-color">
            {name}
          </Text>
        </View>
      ))}
    </View>
  );
}

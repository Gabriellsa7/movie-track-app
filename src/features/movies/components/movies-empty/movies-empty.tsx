import { Text, View } from 'react-native';

interface IMoviesEmptyProps {
  // With a search, "nothing found" is a different message from "nothing registered yet".
  search: string;
}

export function MoviesEmpty({ search }: IMoviesEmptyProps) {
  return (
    <View className="gap-1 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
      <Text className="font-semibold text-sm text-primary-text-color">
        {search
          ? `Nenhum filme encontrado para “${search}”`
          : 'Nenhum filme registrado ainda'}
      </Text>
      <Text className="font-sans text-caption text-tertiary-text-color">
        {search
          ? 'Confira o título ou tente outra busca.'
          : 'Toque no + para registrar o primeiro.'}
      </Text>
    </View>
  );
}

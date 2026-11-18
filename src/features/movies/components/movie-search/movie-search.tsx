import { Search } from 'lucide-react-native';
import { TextInput, View } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

interface IMovieSearchProps {
  value: string;
  onChangeText: (value: string) => void;
}

export function MovieSearch({ value, onChangeText }: IMovieSearchProps) {
  const scheme = useAppTheme();

  return (
    <View className="justify-center">
      <View className="absolute left-3.5 z-10">
        <Search size={18} color={color(scheme, 'tertiary-text-color')} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        accessibilityLabel="Search movies"
        placeholder="Search movies"
        placeholderTextColor={color(scheme, 'tertiary-text-color')}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
        className="min-h-[48px] rounded-xl border border-primary-border-color bg-secondary-bg-color pl-11 pr-3.5 font-sans text-base text-primary-text-color"
      />
    </View>
  );
}

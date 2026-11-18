import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { ROUTES } from '@/routes/routes.constants';

interface IMovieFormHeaderProps {
  title: string;
  isSaving: boolean;
  onSave: () => void;
}

export function closeMovieForm() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(ROUTES.movies);
  }
}

export function MovieFormHeader({
  title,
  isSaving,
  onSave,
}: IMovieFormHeaderProps) {
  return (
    <View className="h-14 flex-row items-center justify-between border-b border-primary-border-color px-3">
      <Pressable
        accessibilityRole="button"
        onPress={closeMovieForm}
        className="h-11 justify-center px-2"
      >
        <Text className="font-semibold text-[15px] text-secondary-text-color">
          Cancel
        </Text>
      </Pressable>
      <Text
        accessibilityRole="header"
        className="font-semibold text-base text-primary-text-color"
      >
        {title}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save"
        accessibilityState={{ disabled: isSaving }}
        disabled={isSaving}
        onPress={onSave}
        className="h-11 justify-center px-2 disabled:opacity-60"
      >
        <Text className="font-bold text-[15px] text-accent-text-color">
          {isSaving ? 'Saving…' : 'Save'}
        </Text>
      </Pressable>
    </View>
  );
}

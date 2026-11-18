import { Pressable, Text, View } from 'react-native';

export function SectionError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View className="flex-row items-center gap-3 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-4">
      <Text className="flex-1 font-sans text-caption text-secondary-text-color">
        {message}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        className="h-11 justify-center"
      >
        <Text className="font-semibold text-label text-accent-text-color">
          Try again
        </Text>
      </Pressable>
    </View>
  );
}

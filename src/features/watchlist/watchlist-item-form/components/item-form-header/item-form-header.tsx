import { Pressable, Text, View } from 'react-native';
import { goBackOr } from '@/lib/navigation';
import { ROUTES } from '@/routes/routes.constants';

export function closeItemForm() {
  goBackOr(ROUTES.watchlist);
}

export function ItemFormHeader({ title }: { title: string }) {
  return (
    <View className="h-14 flex-row items-center justify-center border-b border-primary-border-color px-3">
      <Pressable
        accessibilityRole="button"
        onPress={closeItemForm}
        className="absolute bottom-0 left-3 top-0 justify-center px-2"
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
    </View>
  );
}

import { Pressable, Text, View } from 'react-native';

interface IItemFormFooterProps {
  label: string;
  isSaving: boolean;
  onSave: () => void;
}

export function ItemFormFooter({
  label,
  isSaving,
  onSave,
}: IItemFormFooterProps) {
  return (
    <View className="items-center border-t border-primary-border-color bg-primary-bg-color py-3">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: isSaving }}
        disabled={isSaving}
        onPress={onSave}
        style={{ width: '90%' }}
        className="h-[52px] items-center justify-center rounded-xl bg-accent-bg-color active:bg-accent-hover-bg-color disabled:opacity-60"
      >
        <Text className="font-semibold text-base text-on-accent-text-color">
          {isSaving ? 'Saving…' : label}
        </Text>
      </Pressable>
    </View>
  );
}

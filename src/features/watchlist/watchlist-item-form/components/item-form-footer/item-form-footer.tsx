import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
          {isSaving ? t('common.saving') : label}
        </Text>
      </Pressable>
    </View>
  );
}

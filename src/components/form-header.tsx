import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface IFormHeaderProps {
  title: string;
  saveLabel?: string;
  isSaving: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export function FormHeader({
  title,
  saveLabel,
  isSaving,
  onCancel,
  onSave,
}: IFormHeaderProps) {
  const { t } = useTranslation();
  return (
    <View className="h-14 flex-row items-center justify-between border-b border-primary-border-color px-3">
      <Pressable
        accessibilityRole="button"
        onPress={onCancel}
        className="h-11 justify-center px-2"
      >
        <Text className="font-semibold text-[15px] text-secondary-text-color">
          {t('common.cancel')}
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
        accessibilityLabel={saveLabel ?? t('common.save')}
        accessibilityState={{ disabled: isSaving }}
        disabled={isSaving}
        onPress={onSave}
        className="h-11 justify-center px-2 disabled:opacity-60"
      >
        <Text className="font-bold text-[15px] text-accent-text-color">
          {isSaving ? t('common.saving') : (saveLabel ?? t('common.save'))}
        </Text>
      </Pressable>
    </View>
  );
}

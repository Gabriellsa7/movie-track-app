import { Check } from 'lucide-react-native';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';

export interface IOption<TValue> {
  label: string;
  value: TValue;
}

interface IOptionSheetProps<TValue> {
  title: string;
  visible: boolean;
  options: IOption<TValue>[];
  selected: TValue;
  onSelect: (value: TValue) => void;
  onClose: () => void;
}

export function OptionSheet<TValue>({
  title,
  visible,
  options,
  selected,
  onSelect,
  onClose,
}: IOptionSheetProps<TValue>) {
  const scheme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityLabel={t('common.close')}
        onPress={onClose}
        className="flex-1 bg-overlay-bg-color/60"
      />
      <View
        className="max-h-[70%] rounded-t-[20px] border-t border-primary-border-color bg-secondary-bg-color px-5 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Text
          accessibilityRole="header"
          className="pb-2 font-semibold text-base text-primary-text-color"
        >
          {title}
        </Text>
        <ScrollView>
          {options.map((option) => {
            const isSelected = option.value === selected;
            return (
              <Pressable
                key={option.label}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
                className="h-12 flex-row items-center justify-between border-b border-primary-border-color"
              >
                <Text
                  className={`text-[15px] ${
                    isSelected
                      ? 'font-semibold text-accent-text-color'
                      : 'font-sans text-primary-text-color'
                  }`}
                >
                  {option.label}
                </Text>
                {isSelected && (
                  <Check size={18} color={color(scheme, 'accent-text-color')} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

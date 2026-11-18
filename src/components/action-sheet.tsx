import type { LucideIcon } from 'lucide-react-native';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

export interface IAction {
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
  onPress: () => void;
}

interface IActionSheetProps {
  title: string;
  message?: string;
  visible: boolean;
  actions: IAction[];
  onClose: () => void;
}

export function ActionSheet({
  title,
  message,
  visible,
  actions,
  onClose,
}: IActionSheetProps) {
  const scheme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityLabel="Close"
        onPress={onClose}
        className="flex-1 bg-overlay-bg-color/60"
      />
      <View
        className="gap-2 rounded-t-[22px] border-t border-primary-border-color bg-secondary-bg-color px-5 pt-2.5"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="mb-1 h-1 w-10 self-center rounded-sm bg-secondary-border-color" />
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          className="pb-1 font-semibold text-base text-primary-text-color"
        >
          {title}
        </Text>
        {message ? (
          <Text className="pb-1 font-sans text-sm text-tertiary-text-color">
            {message}
          </Text>
        ) : null}
        {actions.map(({ label, icon: Icon, destructive = false, onPress }) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            onPress={() => {
              onClose();
              onPress();
            }}
            className="h-[52px] flex-row items-center gap-3 rounded-xl border border-primary-border-color bg-primary-bg-color px-4 active:opacity-80"
          >
            <Icon
              size={20}
              color={color(
                scheme,
                destructive ? 'danger-text-color' : 'primary-text-color',
              )}
            />
            <Text
              className={`font-semibold text-[15px] ${
                destructive
                  ? 'text-danger-text-color'
                  : 'text-primary-text-color'
              }`}
            >
              {label}
            </Text>
          </Pressable>
        ))}
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          className="h-[52px] items-center justify-center"
        >
          <Text className="font-semibold text-[15px] text-secondary-text-color">
            Cancel
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

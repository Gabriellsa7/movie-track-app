import { ChevronLeft, Share2 } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { goBackOr } from '@/lib/navigation';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import type { Href } from 'expo-router';

interface IProfileTopBarProps {
  backLabel: string;
  backTo: Href;
  shareLabel: string;
  onShare?: () => void;
}

export function ProfileTopBar({
  backLabel,
  backTo,
  shareLabel,
  onShare,
}: IProfileTopBarProps) {
  const scheme = useAppTheme();
  const iconColor = color(scheme, 'primary-text-color');

  return (
    <View className="-mx-2.5 flex-row items-center justify-between">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={backLabel}
        onPress={() => {
          goBackOr(backTo);
        }}
        className="h-11 w-11 items-center justify-center"
      >
        <ChevronLeft size={22} strokeWidth={2.4} color={iconColor} />
      </Pressable>
      {onShare && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={shareLabel}
          onPress={onShare}
          className="h-11 w-11 items-center justify-center"
        >
          <Share2 size={20} color={iconColor} />
        </Pressable>
      )}
    </View>
  );
}

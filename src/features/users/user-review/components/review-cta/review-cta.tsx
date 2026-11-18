import { Bookmark } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';

interface IReviewCtaProps {
  isAdding: boolean;
  onWantToWatch: () => void;
  onAlreadyWatched: () => void;
}

export function ReviewCta({
  isAdding,
  onWantToWatch,
  onAlreadyWatched,
}: IReviewCtaProps) {
  const { t } = useTranslation();
  const scheme = useAppTheme();

  return (
    <View className="gap-2.5 rounded-[14px] border border-primary-border-color bg-sidebar-bg-color p-3.5">
      <Text className="font-sans text-[13px] text-secondary-text-color">
        {t('users.review.notSeen')}
      </Text>
      <View className="flex-row gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isAdding }}
          disabled={isAdding}
          onPress={onWantToWatch}
          className="h-11 flex-1 flex-row items-center justify-center gap-1.5 rounded-[10px] border border-primary-border-color bg-secondary-bg-color disabled:opacity-60"
        >
          <Bookmark size={16} color={color(scheme, 'primary-text-color')} />
          <Text className="font-semibold text-sm text-primary-text-color">
            {isAdding
              ? t('users.review.adding')
              : t('users.review.wantToWatch')}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onAlreadyWatched}
          className="h-11 flex-1 items-center justify-center rounded-[10px] bg-accent-bg-color active:bg-accent-hover-bg-color"
        >
          <Text className="font-semibold text-sm text-on-accent-text-color">
            {t('users.review.alreadyWatched')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

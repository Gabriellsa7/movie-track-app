import { X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { Poster } from '@/components/poster';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';

interface IWatchedHeaderProps {
  title: string;
  posterUrl: string | undefined;
  onClose: () => void;
}

export function WatchedHeader({
  title,
  posterUrl,
  onClose,
}: IWatchedHeaderProps) {
  const { t } = useTranslation();
  const scheme = useAppTheme();

  return (
    <View className="flex-row items-center gap-3">
      <Poster
        title={title}
        posterUrl={posterUrl}
        showTitle={false}
        className="h-[66px] w-11 rounded-md"
      />
      <View className="min-w-0 flex-1">
        <Text className="font-sans text-xs text-tertiary-text-color">
          {t('watchlist.watched.title')}
        </Text>
        <Text
          accessibilityRole="header"
          numberOfLines={2}
          className="mt-0.5 font-semibold text-lg text-primary-text-color"
        >
          {title}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.close')}
        onPress={onClose}
        className="h-11 w-11 items-center justify-center rounded-xl"
      >
        <X size={20} color={color(scheme, 'secondary-text-color')} />
      </Pressable>
    </View>
  );
}

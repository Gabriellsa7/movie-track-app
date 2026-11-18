import { Heart, Repeat, Share2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';

interface IMovieActionsProps {
  isFavorite: boolean;
  isRewatching: boolean;
  onToggleFavorite: () => void;
  onRewatch: () => void;
  onShare: () => void;
}

const BUTTON =
  'h-14 flex-1 items-center justify-center gap-1 rounded-xl border active:opacity-80';

export function MovieActions({
  isFavorite,
  isRewatching,
  onToggleFavorite,
  onRewatch,
  onShare,
}: IMovieActionsProps) {
  const { t } = useTranslation();
  const scheme = useAppTheme();
  const accent = color(scheme, 'accent-text-color');
  const text = color(scheme, 'primary-text-color');

  return (
    <View className="flex-row gap-2">
      <Pressable
        accessibilityRole="switch"
        accessibilityLabel={t('movies.detail.favorite')}
        accessibilityState={{ checked: isFavorite }}
        onPress={onToggleFavorite}
        className={`${BUTTON} ${
          isFavorite
            ? 'border-accent-bg-color bg-accent-soft-bg-color'
            : 'border-primary-border-color bg-secondary-bg-color'
        }`}
      >
        <Heart
          size={18}
          color={isFavorite ? accent : text}
          fill={isFavorite ? accent : 'transparent'}
        />
        <Text
          className={`font-semibold text-xs ${
            isFavorite ? 'text-accent-text-color' : 'text-primary-text-color'
          }`}
        >
          {t('movies.detail.favorite')}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isRewatching }}
        disabled={isRewatching}
        onPress={onRewatch}
        className={`${BUTTON} border-primary-border-color bg-secondary-bg-color disabled:opacity-60`}
      >
        <Repeat size={18} color={text} />
        <Text className="font-semibold text-xs text-primary-text-color">
          {t('movies.detail.watchedAgain')}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onShare}
        className={`${BUTTON} border-primary-border-color bg-secondary-bg-color`}
      >
        <Share2 size={18} color={text} />
        <Text className="font-semibold text-xs text-primary-text-color">
          {t('movies.detail.share')}
        </Text>
      </Pressable>
    </View>
  );
}

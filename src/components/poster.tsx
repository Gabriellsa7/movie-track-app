import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface IPosterProps {
  title: string;
  posterUrl?: string;
  className?: string;
  showTitle?: boolean;
}

export function Poster({
  title,
  posterUrl,
  className,
  showTitle = true,
}: IPosterProps) {
  const { t } = useTranslation();
  return (
    <View
      className={`overflow-hidden border border-primary-border-color bg-tertiary-bg-color ${className ?? ''}`}
    >
      {posterUrl ? (
        <Image
          source={{ uri: posterUrl }}
          accessibilityLabel={t('common.poster.of', { title })}
          contentFit="cover"
          transition={150}
          style={{ flex: 1 }}
        />
      ) : showTitle ? (
        <View className="flex-1 justify-end p-2">
          <Text
            numberOfLines={3}
            className="font-display text-lg leading-[18px] text-primary-text-color"
          >
            {title}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

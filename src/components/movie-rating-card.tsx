import { Text, View } from 'react-native';
import { RatingStars } from '@/components/rating-stars';
import { useLanguage } from '@/i18n';
import { formatDecimal } from '@/i18n/format';

export function MovieRatingCard({ rating }: { rating: number }) {
  const language = useLanguage();

  return (
    <View className="flex-row items-center gap-3 rounded-[14px] border border-primary-border-color bg-secondary-bg-color p-3.5">
      <RatingStars rating={rating} size={20} />
      <Text className="ml-auto font-display text-[34px] leading-[34px] text-accent-text-color">
        {formatDecimal(rating, 1, language)}
      </Text>
    </View>
  );
}

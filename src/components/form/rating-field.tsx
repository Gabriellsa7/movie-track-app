import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { Text, View } from 'react-native';
import { RatingStars } from '@/components/rating-stars';
import { formatRating } from '@/lib/rating';
import { useTranslation } from 'react-i18next';
import { translateMessage } from '@/i18n/message';
import { useLanguage } from '@/i18n';

interface IRatingFieldProps<
  TFields extends FieldValues,
  TTransformed = TFields,
> {
  control: Control<TFields, unknown, TTransformed>;
  name: FieldPath<TFields>;
}

export function RatingField<
  TFields extends FieldValues,
  TTransformed = TFields,
>({ control, name }: IRatingFieldProps<TFields, TTransformed>) {
  const {
    field: { value, onChange },
    fieldState,
  } = useController({ control, name });
  const rating = value as number | undefined;
  const error = fieldState.error?.message;
  const { t } = useTranslation();
  const language = useLanguage();

  return (
    <View className="gap-1.5">
      <Text className="font-semibold text-[13px] text-primary-text-color">
        {t('common.rating.yours')} *
      </Text>
      <View className="flex-row items-center justify-between">
        <RatingStars rating={rating} size={28} onChange={onChange} />
        <Text className="font-display text-[34px] leading-[34px] text-accent-text-color">
          {rating === undefined ? '–' : formatRating(rating, language)}
        </Text>
      </View>
      {error ? (
        <Text
          accessibilityRole="alert"
          className="font-medium text-xs text-danger-text-color"
        >
          {translateMessage(error, language)}
        </Text>
      ) : (
        <Text className="font-sans text-xs text-tertiary-text-color">
          {t('common.rating.halfHint')}
        </Text>
      )}
    </View>
  );
}

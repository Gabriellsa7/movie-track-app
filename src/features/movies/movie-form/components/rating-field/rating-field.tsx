import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { Text, View } from 'react-native';
import { formatRating, RatingStars } from '@/components/rating-stars';

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

  return (
    <View className="gap-1.5">
      <Text className="font-semibold text-[13px] text-primary-text-color">
        Your rating *
      </Text>
      <View className="flex-row items-center justify-between">
        <RatingStars rating={rating} size={28} onChange={onChange} />
        <Text className="font-display text-[34px] leading-[34px] text-accent-text-color">
          {rating === undefined ? '–' : formatRating(rating)}
        </Text>
      </View>
      {error ? (
        <Text
          accessibilityRole="alert"
          className="font-medium text-xs text-danger-text-color"
        >
          {error}
        </Text>
      ) : (
        <Text className="font-sans text-xs text-tertiary-text-color">
          Tap the left half of a star for a half point
        </Text>
      )}
    </View>
  );
}

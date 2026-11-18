import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { Pressable, ScrollView, Text } from 'react-native';
import { FieldFrame } from '@/components/form/field-frame';
import { RATING_STEP } from '@/lib/validation/rules';

interface IRatingPickerProps<
  TFields extends FieldValues,
  TTransformed = TFields,
> {
  control: Control<TFields, unknown, TTransformed>;
  name: FieldPath<TFields>;
  label: string;
}

const MIN_RATING = 1;
const MAX_RATING = 10;
const RATINGS = Array.from(
  { length: (MAX_RATING - MIN_RATING) / RATING_STEP + 1 },
  (_, index) => MIN_RATING + index * RATING_STEP,
);

function formatRating(rating: number): string {
  return rating.toLocaleString('en-US');
}

export function RatingPicker<
  TFields extends FieldValues,
  TTransformed = TFields,
>({ control, name, label }: IRatingPickerProps<TFields, TTransformed>) {
  const {
    field: { value, onChange },
    fieldState,
  } = useController({ control, name });

  return (
    <FieldFrame label={label} error={fieldState.error?.message}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-5"
        contentContainerClassName="gap-2 px-5"
      >
        {RATINGS.map((rating) => {
          const isSelected = value === rating;
          return (
            <Pressable
              key={rating}
              accessibilityRole="radio"
              accessibilityLabel={`Rating ${formatRating(rating)}`}
              accessibilityState={{ selected: isSelected }}
              onPress={() => {
                onChange(rating);
              }}
              className={`h-11 min-w-11 items-center justify-center rounded-xl border px-2.5 ${
                isSelected
                  ? 'border-accent-bg-color bg-accent-bg-color'
                  : 'border-primary-border-color bg-secondary-bg-color'
              }`}
            >
              <Text
                className={`font-semibold text-sm ${
                  isSelected
                    ? 'text-on-accent-text-color'
                    : 'text-primary-text-color'
                }`}
              >
                {formatRating(rating)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </FieldFrame>
  );
}

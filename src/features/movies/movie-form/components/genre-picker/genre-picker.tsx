import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { useGenresQuery } from '@/api/get-genres';
import { FieldFrame } from '@/components/form/field-frame';
import { SectionError } from '@/components/section-error';
import { Skeleton } from '@/components/skeleton';
import { MAX_GENRES } from '@/lib/validation/rules';

interface IGenrePickerProps<
  TFields extends FieldValues,
  TTransformed = TFields,
> {
  control: Control<TFields, unknown, TTransformed>;
  name: FieldPath<TFields>;
  label: string;
}

const SKELETON_CHIPS = [0, 1, 2, 3, 4, 5];

export function GenrePicker<
  TFields extends FieldValues,
  TTransformed = TFields,
>({ control, name, label }: IGenrePickerProps<TFields, TTransformed>) {
  const genres = useGenresQuery();
  const {
    field: { value, onChange },
    fieldState,
  } = useController({ control, name });
  const selected: string[] = Array.isArray(value) ? (value as string[]) : [];
  const isFull = selected.length >= MAX_GENRES;

  function toggle(genreId: string) {
    onChange(
      selected.includes(genreId)
        ? selected.filter((id) => id !== genreId)
        : [...selected, genreId],
    );
  }

  return (
    <FieldFrame
      label={label}
      error={fieldState.error?.message}
      hint={`Up to ${String(MAX_GENRES)}`}
    >
      {genres.isPending ? (
        <View className="flex-row flex-wrap gap-2">
          {SKELETON_CHIPS.map((chip) => (
            <Skeleton key={chip} className="h-9 w-20 rounded-full" />
          ))}
        </View>
      ) : genres.isError ? (
        <SectionError
          message="Couldn't load the genres."
          onRetry={() => void genres.refetch()}
        />
      ) : (
        <View className="flex-row flex-wrap gap-2">
          {genres.data.map((genre) => {
            const isSelected = selected.includes(genre.id);
            const isDisabled = !isSelected && isFull;
            return (
              <Pressable
                key={genre.id}
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: isSelected,
                  disabled: isDisabled,
                }}
                disabled={isDisabled}
                onPress={() => {
                  toggle(genre.id);
                }}
                className={`h-9 justify-center rounded-full border px-3.5 ${
                  isSelected
                    ? 'border-accent-border-color bg-accent-soft-bg-color'
                    : 'border-primary-border-color bg-secondary-bg-color'
                } ${isDisabled ? 'opacity-40' : ''}`}
              >
                <Text
                  className={`font-medium text-sm ${
                    isSelected
                      ? 'text-accent-text-color'
                      : 'text-secondary-text-color'
                  }`}
                >
                  {genre.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </FieldFrame>
  );
}

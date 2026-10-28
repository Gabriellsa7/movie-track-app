import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { Platform, Pressable, Text } from 'react-native';
import { toIsoDate } from '@/lib/validation/rules';
import { FieldFrame, inputClassName } from './field-frame';

interface IDateFieldProps<TFields extends FieldValues> {
  control: Control<TFields>;
  name: FieldPath<TFields>;
  label: string;
  hint?: string;
  maximumDate?: Date;
}

// The form value is YYYY-MM-DD, what the API expects; parsed in local time.
function fromIsoDate(value: unknown): Date {
  if (typeof value !== 'string' || !value) {
    return new Date();
  }
  const [year = 0, month = 1, day = 1] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value: unknown): string {
  return typeof value === 'string' && value
    ? fromIsoDate(value).toLocaleDateString('pt-BR')
    : 'Escolher data';
}

export function DateField<TFields extends FieldValues>({
  control,
  name,
  label,
  hint,
  maximumDate,
}: IDateFieldProps<TFields>) {
  const {
    field: { value, onChange },
    fieldState,
  } = useController({ control, name });
  const [open, setOpen] = useState(false);
  const error = fieldState.error?.message;

  const onValueChange = (_event: unknown, date: Date) => {
    // Android closes its dialog after a choice; iOS keeps the inline picker open.
    setOpen(Platform.OS === 'ios');
    onChange(toIsoDate(date));
  };

  return (
    <FieldFrame label={label} error={error} hint={hint}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${formatDate(value)}`}
        onPress={() => {
          setOpen(true);
        }}
        className={`justify-center ${inputClassName(Boolean(error))}`}
      >
        <Text className="font-sans text-base text-text">
          {formatDate(value)}
        </Text>
      </Pressable>
      {open && (
        <DateTimePicker
          value={fromIsoDate(value)}
          mode="date"
          maximumDate={maximumDate}
          onValueChange={onValueChange}
          onDismiss={() => {
            setOpen(false);
          }}
        />
      )}
    </FieldFrame>
  );
}

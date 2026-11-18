import { useState } from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { Pressable, Text } from 'react-native';
import { CalendarSheet } from '@/components/calendar-sheet';
import { toIsoDate } from '@/lib/validation/rules';
import { FieldFrame, inputClassName } from './field-frame';
import { useTranslation } from 'react-i18next';
import { currentLanguage } from '@/i18n';

interface IDateFieldProps<TFields extends FieldValues, TTransformed = TFields> {
  control: Control<TFields, unknown, TTransformed>;
  name: FieldPath<TFields>;
  label: string;
  hint?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

function fromIsoDate(value: unknown): Date {
  if (typeof value !== 'string' || !value) {
    return new Date();
  }
  const [year = 0, month = 1, day = 1] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value: unknown, emptyLabel: string): string {
  return typeof value === 'string' && value
    ? fromIsoDate(value).toLocaleDateString(currentLanguage())
    : emptyLabel;
}

export function DateField<TFields extends FieldValues, TTransformed = TFields>({
  control,
  name,
  label,
  hint,
  minimumDate,
  maximumDate,
}: IDateFieldProps<TFields, TTransformed>) {
  const {
    field: { value, onChange },
    fieldState,
  } = useController({ control, name });
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dateLabel = formatDate(value, t('common.calendar.pickDate'));
  const error = fieldState.error?.message;

  return (
    <FieldFrame label={label} error={error} hint={hint}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${dateLabel}`}
        onPress={() => {
          setOpen(true);
        }}
        className={`justify-center ${inputClassName(Boolean(error))}`}
      >
        <Text className="font-sans text-base text-primary-text-color">
          {dateLabel}
        </Text>
      </Pressable>
      <CalendarSheet
        title={label}
        visible={open}
        selected={
          typeof value === 'string' && value ? fromIsoDate(value) : undefined
        }
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onSelect={(date) => {
          onChange(toIsoDate(date));
        }}
        onClose={() => {
          setOpen(false);
        }}
      />
    </FieldFrame>
  );
}

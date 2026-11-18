import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import type { ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { FieldFrame, inputClassName } from './field-frame';

export interface ITextFieldProps<
  TFields extends FieldValues,
  TTransformed = TFields,
> extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  control: Control<TFields, unknown, TTransformed>;
  name: FieldPath<TFields>;
  label: string;
  hint?: string;
  trailing?: ReactNode;
}

export function TextField<TFields extends FieldValues, TTransformed = TFields>({
  control,
  name,
  label,
  hint,
  trailing,
  ...inputProps
}: ITextFieldProps<TFields, TTransformed>) {
  const scheme = useAppTheme();
  const {
    field: { ref, value, onChange, onBlur },
    fieldState,
  } = useController({ control, name });
  const error = fieldState.error?.message;

  return (
    <FieldFrame label={label} error={error} hint={hint}>
      <View className="justify-center">
        <TextInput
          ref={ref}
          value={typeof value === 'string' ? value : ''}
          onChangeText={onChange}
          onBlur={onBlur}
          accessibilityLabel={label}
          aria-invalid={error ? true : undefined}
          placeholderTextColor={color(scheme, 'tertiary-text-color')}
          className={`${inputClassName(Boolean(error))} ${trailing ? 'pr-14' : ''}`}
          {...inputProps}
        />
        {trailing && <View className="absolute right-2.5">{trailing}</View>}
      </View>
    </FieldFrame>
  );
}

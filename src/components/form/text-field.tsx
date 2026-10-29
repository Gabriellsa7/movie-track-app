import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { TextInput, type TextInputProps } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { rgb } from '@/theme/palette';
import { FieldFrame, inputClassName } from './field-frame';

export type TTextFieldProps<TFields extends FieldValues> = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'onBlur'
> & {
  control: Control<TFields>;
  name: FieldPath<TFields>;
  label: string;
  hint?: string;
};

export function TextField<TFields extends FieldValues>({
  control,
  name,
  label,
  hint,
  ...inputProps
}: TTextFieldProps<TFields>) {
  const scheme = useAppTheme();
  const {
    field: { ref, value, onChange, onBlur },
    fieldState,
  } = useController({ control, name });
  const error = fieldState.error?.message;

  return (
    <FieldFrame label={label} error={error} hint={hint}>
      <TextInput
        ref={ref}
        value={typeof value === 'string' ? value : ''}
        onChangeText={onChange}
        onBlur={onBlur}
        accessibilityLabel={label}
        aria-invalid={error ? true : undefined}
        placeholderTextColor={rgb(scheme, 'tertiary-text-color')}
        className={inputClassName(Boolean(error))}
        {...inputProps}
      />
    </FieldFrame>
  );
}

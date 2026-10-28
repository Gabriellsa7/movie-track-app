import type { FieldValues } from 'react-hook-form';
import { TextField, type TTextFieldProps } from './text-field';

export function TextAreaField<TFields extends FieldValues>(
  props: TTextFieldProps<TFields>,
) {
  return (
    <TextField
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      style={{ minHeight: 110, paddingTop: 12 }}
      {...props}
    />
  );
}

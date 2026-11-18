import type { FieldValues } from 'react-hook-form';
import { TextField, type ITextFieldProps } from './text-field';

export function TextAreaField<
  TFields extends FieldValues,
  TTransformed = TFields,
>(props: ITextFieldProps<TFields, TTransformed>) {
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

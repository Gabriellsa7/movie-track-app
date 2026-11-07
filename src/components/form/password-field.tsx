import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { Pressable } from 'react-native';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { TextField, type TTextFieldProps } from './text-field';

export function PasswordField<TFields extends FieldValues>(
  props: TTextFieldProps<TFields>,
) {
  const scheme = useAppTheme();
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <TextField
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
      trailing={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
          onPress={() => {
            setVisible((current) => !current);
          }}
          className="h-11 w-11 items-center justify-center"
        >
          <Icon size={20} color={color(scheme, 'tertiary-text-color')} />
        </Pressable>
      }
    />
  );
}

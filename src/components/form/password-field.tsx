import { useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { TextField, type TTextFieldProps } from './text-field';

export function PasswordField<TFields extends FieldValues>(
  props: TTextFieldProps<TFields>,
) {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TextField
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: visible }}
        onPress={() => {
          setVisible((current) => !current);
        }}
        className="mt-1.5 self-end"
        hitSlop={8}
      >
        <Text className="font-semibold text-xs text-accent-text-color">
          {visible ? 'Ocultar senha' : 'Mostrar senha'}
        </Text>
      </Pressable>
    </View>
  );
}

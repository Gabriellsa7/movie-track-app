import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { login } from '@/api/services/auth.service';
import { PasswordField } from '@/components/form/password-field';
import { TextField } from '@/components/form/text-field';
import { startSession } from '@/lib/session/session';
import { ROUTES } from '@/routes/routes.constants';
import {
  LOGIN_DEFAULT_VALUES,
  LOGIN_ERROR_MESSAGES,
  LOGIN_SCHEMA,
  type TLoginForm,
} from './constants/constants';

export function LoginForm() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<TLoginForm>({
    resolver: zodResolver(LOGIN_SCHEMA),
    defaultValues: LOGIN_DEFAULT_VALUES,
  });

  const onSubmit = async (values: TLoginForm) => {
    try {
      const tokens = await login(values);
      await startSession(tokens);
    } catch (error) {
      const message = ApiError.from(error).is(EApiErrorCode.INVALID_CREDENTIALS)
        ? LOGIN_ERROR_MESSAGES.invalidCredentials
        : LOGIN_ERROR_MESSAGES.unexpected;
      setError('root', { message });
    }
  };

  return (
    <View className="gap-[18px]">
      <TextField
        control={control}
        name="email"
        label="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <PasswordField
        control={control}
        name="password"
        label="Senha"
        autoComplete="current-password"
      />

      <Link href={ROUTES.forgotPassword} asChild>
        <Text className="self-end font-semibold text-sm text-accent-text-color">
          Esqueci a senha
        </Text>
      </Link>

      {errors.root && (
        <Text
          accessibilityRole="alert"
          className="font-medium text-sm text-danger-text-color"
        >
          {errors.root.message}
        </Text>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isSubmitting }}
        disabled={isSubmitting}
        onPress={() => void handleSubmit(onSubmit)()}
        className="h-[52px] items-center justify-center rounded-xl bg-accent-bg-color active:bg-accent-hover-bg-color disabled:opacity-60"
      >
        <Text className="font-semibold text-base text-on-accent-text-color">
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </Text>
      </Pressable>
    </View>
  );
}

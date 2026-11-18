import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { toast } from 'sonner-native';
import { login } from '@/api/post-login';
import { PasswordField } from '@/components/form/password-field';
import { TextField } from '@/components/form/text-field';
import { authErrorMessage } from '@/lib/forms/auth-error-message';
import { startSession } from '@/lib/session/session';
import { ROUTES } from '@/routes/routes.constants';
import {
  LOGIN_DEFAULT_VALUES,
  LOGIN_ERROR_MESSAGES,
  LOGIN_SCHEMA,
  type ILoginForm,
} from './constants/constants';

export function LoginForm() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<ILoginForm>({
    resolver: zodResolver(LOGIN_SCHEMA),
    defaultValues: LOGIN_DEFAULT_VALUES,
  });

  const onSubmit = async (values: ILoginForm) => {
    try {
      const tokens = await login(values);
      await startSession(tokens);
    } catch (error) {
      const message = authErrorMessage(error, LOGIN_ERROR_MESSAGES.unexpected);
      setError('root', { message });
      toast.error(message);
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
        label="Password"
        autoComplete="current-password"
      />

      <Link href={ROUTES.forgotPassword} asChild>
        <Text className="self-end font-semibold text-sm text-accent-text-color">
          Forgot password
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
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </Text>
      </Pressable>
    </View>
  );
}

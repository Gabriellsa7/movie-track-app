import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useForm, useWatch } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { login } from '@/api/services/auth.service';
import { signUp } from '@/api/services/user.service';
import { PasswordField } from '@/components/form/password-field';
import { PasswordRules } from '@/components/form/password-rules';
import { TextField } from '@/components/form/text-field';
import { applyApiErrors } from '@/lib/forms/apply-api-errors';
import { startSession } from '@/lib/session/session';
import { ROUTES } from '@/routes/routes.constants';
import {
  SIGN_UP_DEFAULT_VALUES,
  SIGN_UP_ERROR_MESSAGES,
  SIGN_UP_FIELDS,
  SIGN_UP_SCHEMA,
  type TSignUpForm,
} from '../../constants/constants';

export function SignUpForm() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<TSignUpForm>({
    resolver: zodResolver(SIGN_UP_SCHEMA),
    defaultValues: SIGN_UP_DEFAULT_VALUES,
  });
  const password = useWatch({ control, name: 'password' });

  // After the account is created, logs in with the same credentials and opens Início.
  const onSubmit = async (values: TSignUpForm) => {
    try {
      await signUp(values);
      const tokens = await login({
        email: values.email,
        password: values.password,
      });
      await startSession(tokens);
    } catch (error) {
      if (!applyApiErrors(error, setError, SIGN_UP_FIELDS)) {
        setError('root', { message: SIGN_UP_ERROR_MESSAGES.unexpected });
      }
    }
  };

  return (
    <View className="flex-1 gap-4">
      <TextField
        control={control}
        name="name"
        label="Nome ou apelido"
        autoComplete="nickname"
        autoCapitalize="words"
      />
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
        autoComplete="new-password"
      />
      <PasswordRules password={password} />

      <View className="mt-auto gap-3.5 pt-4">
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
            {isSubmitting ? 'Criando conta…' : 'Criar conta'}
          </Text>
        </Pressable>

        <Text className="text-center font-sans text-sm text-tertiary-text-color">
          Já tem conta?{' '}
          <Link href={ROUTES.login} asChild>
            <Text className="font-semibold text-accent-text-color">Entrar</Text>
          </Link>
        </Text>
      </View>
    </View>
  );
}

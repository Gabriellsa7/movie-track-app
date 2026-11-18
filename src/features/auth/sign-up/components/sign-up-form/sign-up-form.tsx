import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useForm, useWatch } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { toast } from 'sonner-native';
import { login } from '@/api/post-login';
import { signUp } from '@/features/auth/api/post-sign-up';
import { PasswordField } from '@/components/form/password-field';
import { PasswordRules } from '@/components/form/password-rules';
import { TextField } from '@/components/form/text-field';
import { applyApiErrors } from '@/lib/forms/apply-api-errors';
import { authErrorMessage } from '@/lib/forms/auth-error-message';
import { startSession } from '@/lib/session/session';
import { ROUTES } from '@/routes/routes.constants';
import {
  SIGN_UP_DEFAULT_VALUES,
  SIGN_UP_FIELDS,
  SIGN_UP_SCHEMA,
  type ISignUpForm,
} from '../../constants/constants';
import { useTranslation } from 'react-i18next';

export function SignUpForm() {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<ISignUpForm>({
    resolver: zodResolver(SIGN_UP_SCHEMA),
    defaultValues: SIGN_UP_DEFAULT_VALUES,
  });
  const password = useWatch({ control, name: 'password' });

  const onSubmit = async (values: ISignUpForm) => {
    try {
      await signUp(values);
      const tokens = await login({
        email: values.email,
        password: values.password,
      });
      await startSession(tokens);
    } catch (error) {
      const message = authErrorMessage(error, 'auth.signUpScreen.unexpected');
      if (!applyApiErrors(error, setError, SIGN_UP_FIELDS)) {
        setError('root', { message });
      }
      toast.error(message);
    }
  };

  return (
    <View className="flex-1 gap-4">
      <TextField
        control={control}
        name="name"
        label={t('auth.signUpScreen.name')}
        autoComplete="nickname"
        autoCapitalize="words"
      />
      <TextField
        control={control}
        name="email"
        label={t('auth.email')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <PasswordField
        control={control}
        name="password"
        label={t('auth.password')}
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
            {isSubmitting ? t('auth.signUpScreen.signingUp') : t('auth.signUp')}
          </Text>
        </Pressable>

        <Text className="text-center font-sans text-sm text-tertiary-text-color">
          {t('auth.signUpScreen.haveAccount')}{' '}
          <Link href={ROUTES.login} asChild>
            <Text className="font-semibold text-accent-text-color">
              {t('auth.logIn')}
            </Text>
          </Link>
        </Text>
      </View>
    </View>
  );
}

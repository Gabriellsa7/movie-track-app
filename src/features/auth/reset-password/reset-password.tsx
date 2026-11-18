import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { PasswordField } from '@/components/form/password-field';
import { PasswordRules } from '@/components/form/password-rules';
import { authErrorMessage } from '@/lib/forms/auth-error-message';
import { logout } from '@/lib/session/session';
import { ROUTES } from '@/routes/routes.constants';
import { useSessionStore } from '@/stores/session.store';
import { useResetPasswordMutation } from '../api/post-reset-password';
import { LinkProblem } from '../components/link-problem/link-problem';
import {
  RESET_PASSWORD_SCHEMA,
  type IResetPasswordForm,
} from './constants/constants';
import { useTranslation } from 'react-i18next';

export function ResetPasswordScreen() {
  const { t } = useTranslation();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const resetPassword = useResetPasswordMutation();
  const [linkExpired, setLinkExpired] = useState(!token);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IResetPasswordForm>({
    resolver: zodResolver(RESET_PASSWORD_SCHEMA),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });
  const newPassword = useWatch({ control, name: 'newPassword' });

  const onSubmit = async (values: IResetPasswordForm) => {
    if (!token) {
      return;
    }
    try {
      await resetPassword.mutateAsync({
        token,
        newPassword: values.newPassword,
      });
      if (useSessionStore.getState().status === 'authenticated') {
        await logout();
      }
      toast.success(t('auth.reset.changed'));
      router.replace(ROUTES.login);
    } catch (error) {
      if (ApiError.from(error).is(EApiErrorCode.INVALID_RESET_TOKEN)) {
        setLinkExpired(true);
        return;
      }
      toast.error(authErrorMessage(error, 'auth.reset.unexpected'));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="grow gap-5 px-6 pb-8 pt-[72px]"
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-2">
            <Text
              accessibilityRole="header"
              className="font-display text-[48px] leading-[48px] tracking-[1px] text-primary-text-color"
            >
              {t('auth.reset.title')}
            </Text>
            <Text className="font-sans text-[15px] leading-[22px] text-tertiary-text-color">
              {t('auth.reset.subtitle')}
            </Text>
          </View>

          {linkExpired ? (
            <LinkProblem
              message={t('auth.reset.expired')}
              actionLabel={t('auth.reset.requestAnotherLink')}
              actionHref={ROUTES.forgotPassword}
            />
          ) : (
            <View className="gap-4">
              <PasswordField
                control={control}
                name="newPassword"
                label={t('auth.reset.newPassword')}
                autoComplete="new-password"
              />
              <PasswordRules password={newPassword} />
              <PasswordField
                control={control}
                name="confirmPassword"
                label={t('auth.reset.confirmPassword')}
                autoComplete="new-password"
              />
            </View>
          )}

          {!linkExpired && (
            <View className="mt-auto gap-3.5">
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: isSubmitting }}
                disabled={isSubmitting}
                onPress={() => void handleSubmit(onSubmit)()}
                className="h-[52px] items-center justify-center rounded-xl bg-accent-bg-color active:bg-accent-hover-bg-color disabled:opacity-60"
              >
                <Text className="font-semibold text-base text-on-accent-text-color">
                  {isSubmitting ? t('common.saving') : t('auth.reset.save')}
                </Text>
              </Pressable>
              <Text className="text-center font-sans text-[13px] text-tertiary-text-color">
                {t('auth.reset.expiredQuestion')}{' '}
                <Link href={ROUTES.forgotPassword} replace asChild>
                  <Text className="font-semibold text-accent-text-color">
                    {t('auth.reset.requestAnother')}
                  </Text>
                </Link>
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

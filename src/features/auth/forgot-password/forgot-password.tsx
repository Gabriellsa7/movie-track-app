import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { TextField } from '@/components/form/text-field';
import { authErrorMessage } from '@/lib/forms/auth-error-message';
import { formatCountdown, useCountdown } from '@/lib/use-countdown';
import { ROUTES } from '@/routes/routes.constants';
import { useRequestPasswordResetMutation } from '../api/post-forgot-password';
import { AuthBackButton } from '../components/auth-back-button/auth-back-button';
import { ResetLinkSent } from './components/reset-link-sent/reset-link-sent';
import {
  FORGOT_PASSWORD_MESSAGES,
  FORGOT_PASSWORD_SCHEMA,
  RESEND_WAIT_SECONDS,
  type IForgotPasswordForm,
} from './constants/constants';

export function ForgotPasswordScreen() {
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const requestReset = useRequestPasswordResetMutation();
  const countdown = useCountdown();
  const [sent, setSent] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IForgotPasswordForm>({
    resolver: zodResolver(FORGOT_PASSWORD_SCHEMA),
    defaultValues: { email },
  });
  const isWaiting = countdown.secondsLeft > 0;

  const onSubmit = async (values: IForgotPasswordForm) => {
    try {
      await requestReset.mutateAsync(values.email);
      setSent(true);
      countdown.start(RESEND_WAIT_SECONDS);
    } catch (error) {
      toast.error(authErrorMessage(error, FORGOT_PASSWORD_MESSAGES.unexpected));
    }
  };

  function buttonLabel() {
    if (isSubmitting) {
      return 'Sending…';
    }
    if (isWaiting) {
      return `Resend in ${formatCountdown(countdown.secondsLeft)}`;
    }
    return sent ? 'Resend link' : 'Send link';
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="grow gap-5 px-6 pb-8 pt-2"
          keyboardShouldPersistTaps="handled"
        >
          <AuthBackButton />
          <View className="gap-2">
            <Text
              accessibilityRole="header"
              className="font-display text-[48px] leading-[48px] tracking-[1px] text-primary-text-color"
            >
              Forgot password
            </Text>
            <Text className="font-sans text-[15px] leading-[22px] text-tertiary-text-color">
              Enter your account e-mail. We will send a link to create a new
              password.
            </Text>
          </View>
          <TextField
            control={control}
            name="email"
            label="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {sent && <ResetLinkSent />}

          <View className="mt-auto gap-3.5">
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: isSubmitting || isWaiting }}
              disabled={isSubmitting || isWaiting}
              onPress={() => void handleSubmit(onSubmit)()}
              className={`h-[52px] items-center justify-center rounded-xl ${
                isWaiting
                  ? 'border border-primary-border-color bg-secondary-bg-color'
                  : 'bg-accent-bg-color active:bg-accent-hover-bg-color disabled:opacity-60'
              }`}
            >
              <Text
                className={`font-semibold text-base ${
                  isWaiting
                    ? 'text-tertiary-text-color'
                    : 'text-on-accent-text-color'
                }`}
              >
                {buttonLabel()}
              </Text>
            </Pressable>
            <Link href={ROUTES.login} replace asChild>
              <Pressable
                accessibilityRole="link"
                className="h-11 items-center justify-center self-center"
              >
                <Text className="font-semibold text-sm text-accent-text-color">
                  Back to login
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { queryKeys } from '@/api/query-keys';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { useSessionStore } from '@/stores/session.store';
import { color } from '@/theme/palette';
import { useVerifyEmailMutation } from '../api/post-verify-email';
import { ExpiredLink } from './components/expired-link/expired-link';
import { useTranslation, Trans } from 'react-i18next';

export function VerifyEmailScreen() {
  const scheme = useAppTheme();
  const { t } = useTranslation();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const client = useQueryClient();
  const isLoggedIn = useSessionStore(
    (state) => state.status === 'authenticated',
  );
  const user = useSessionStore((state) => state.user);
  const verifyEmail = useVerifyEmailMutation();
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) {
      return;
    }
    requested.current = true;
    verifyEmail.mutate(token, {
      onSuccess: () => {
        const { user: sessionUser, setUser } = useSessionStore.getState();
        if (sessionUser) {
          setUser({ ...sessionUser, emailVerified: true });
        }
        void client.invalidateQueries({ queryKey: queryKeys.users.all });
      },
    });
  }, [token, verifyEmail, client]);

  function renderStatus() {
    if (!token) {
      return <ExpiredLink isLoggedIn={isLoggedIn} />;
    }
    if (verifyEmail.isError) {
      const expired = ApiError.from(verifyEmail.error).is(
        EApiErrorCode.INVALID_VERIFICATION_TOKEN,
      );
      return expired ? (
        <ExpiredLink isLoggedIn={isLoggedIn} />
      ) : (
        <Text className="text-center font-sans text-[15px] text-secondary-text-color">
          {t('auth.verify.failed')}
        </Text>
      );
    }
    if (verifyEmail.isSuccess) {
      return (
        <View className="items-center gap-[18px]">
          <View className="h-[88px] w-[88px] items-center justify-center rounded-full bg-success-soft-bg-color">
            <Check
              size={40}
              strokeWidth={2.4}
              color={color(scheme, 'success-text-color')}
            />
          </View>
          <Text
            accessibilityRole="header"
            className="text-center font-display text-[48px] leading-[48px] tracking-[1px] text-primary-text-color"
          >
            {t('auth.verify.confirmed')}
          </Text>
          <Text className="text-center font-sans text-[15px] leading-[22px] text-secondary-text-color">
            {user ? (
              <Trans
                i18nKey="auth.verify.confirmedEmail"
                values={{ email: user.email }}
                components={{
                  bold: (
                    <Text className="font-semibold text-primary-text-color" />
                  ),
                }}
              />
            ) : (
              t('auth.verify.confirmedNoEmail')
            )}
          </Text>
        </View>
      );
    }
    return (
      <View className="items-center gap-4">
        <ActivityIndicator color={color(scheme, 'accent-text-color')} />
        <Text className="font-sans text-[15px] text-secondary-text-color">
          {t('auth.verify.confirming')}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color">
      <View className="flex-1 px-6 pb-8 pt-40">
        {renderStatus()}
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            router.replace(isLoggedIn ? ROUTES.home : ROUTES.login);
          }}
          className="mt-auto h-[52px] items-center justify-center rounded-xl bg-accent-bg-color active:bg-accent-hover-bg-color"
        >
          <Text className="font-semibold text-base text-on-accent-text-color">
            {isLoggedIn ? t('auth.verify.goHome') : t('auth.logIn')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

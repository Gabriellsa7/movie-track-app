import { router } from 'expo-router';
import {
  BarChart3,
  Eye,
  ImagePlus,
  Lock,
  LogOut,
  Trash2,
  UserRound,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { ActionSheet, type IAction } from '@/components/action-sheet';
import { notifySaveError } from '@/lib/forms/notify-save-error';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { useRefreshControl } from '@/lib/use-refresh-control';
import { ROUTES } from '@/routes/routes.constants';
import { useSessionStore } from '@/stores/session.store';
import { color } from '@/theme/palette';
import { useAccountQuery } from './api/get-account';
import { useResendVerificationMutation } from './api/post-email-verification';
import { useLogoutMutation } from './api/post-logout';
import { AccountHeader } from './components/account-header/account-header';
import { DeleteAccountSheet } from './components/delete-account-sheet/delete-account-sheet';
import { SettingsRow } from './components/settings-row/settings-row';
import { ThemeSelect } from './components/theme-select/theme-select';
import { VerifyEmailBanner } from './components/verify-email-banner/verify-email-banner';
import { useAvatarActions } from './hooks/use-avatar-actions';

type TSheet = 'photo' | 'delete' | null;

export function AccountScreen() {
  const scheme = useAppTheme();
  const user = useSessionStore((state) => state.user);
  const account = useAccountQuery();
  const refreshControl = useRefreshControl(() => account.refetch());
  const avatar = useAvatarActions();
  const resendVerification = useResendVerificationMutation();
  const logout = useLogoutMutation();
  const [sheet, setSheet] = useState<TSheet>(null);

  if (!user) {
    return null;
  }

  const photoActions: IAction[] = [
    {
      label: user.avatarUrl ? 'Choose another photo' : 'Choose photo',
      icon: ImagePlus,
      onPress: () => void avatar.choose(),
    },
    ...(user.avatarUrl
      ? [
          {
            label: 'Remove photo',
            icon: Trash2,
            destructive: true,
            onPress: avatar.remove,
          },
        ]
      : []),
  ];

  function resend() {
    resendVerification.mutate(undefined, {
      onSuccess: () => {
        toast.success(`We sent a new link to ${user?.email ?? 'your e-mail'}`);
      },
      onError: (error) => {
        notifySaveError(error, "Couldn't send the link. Try again.");
      },
    });
  }

  function closeSheet() {
    setSheet(null);
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color" edges={['top']}>
      <ScrollView
        contentContainerClassName="flex-grow gap-[18px] px-5 pb-6 pt-4"
        refreshControl={refreshControl}
      >
        <Text
          accessibilityRole="header"
          className="font-display text-title-sm tracking-[1px] text-primary-text-color"
        >
          Account
        </Text>

        <AccountHeader
          user={user}
          isSavingPhoto={avatar.isSaving}
          onEditPhoto={() => {
            setSheet('photo');
          }}
        />

        {!user.emailVerified && (
          <VerifyEmailBanner
            isSending={resendVerification.isPending}
            onResend={resend}
          />
        )}

        <View className="overflow-hidden rounded-[14px] border border-primary-border-color bg-secondary-bg-color">
          <SettingsRow
            label="Name and e-mail"
            icon={UserRound}
            onPress={() => {
              router.push(ROUTES.accountDetails);
            }}
          />
          <SettingsRow
            label="Change password"
            icon={Lock}
            onPress={() => {
              router.push(ROUTES.accountPassword);
            }}
          />
          <SettingsRow
            label="My stats"
            icon={BarChart3}
            onPress={() => {
              router.push(ROUTES.stats);
            }}
          />
          <SettingsRow
            label="View my public profile"
            icon={Eye}
            last
            onPress={() => {
              router.push({
                pathname: '/users/[userId]',
                params: { userId: user.id },
              });
            }}
          />
        </View>

        <ThemeSelect />

        <View className="mt-auto gap-1">
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: logout.isPending }}
            disabled={logout.isPending}
            onPress={() => {
              logout.mutate();
            }}
            className="h-12 flex-row items-center gap-2.5 px-1 active:opacity-80"
          >
            <LogOut size={20} color={color(scheme, 'primary-text-color')} />
            <Text className="font-semibold text-[15px] text-primary-text-color">
              Log out
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setSheet('delete');
            }}
            className="h-12 flex-row items-center gap-2.5 px-1 active:opacity-80"
          >
            <Trash2 size={20} color={color(scheme, 'danger-text-color')} />
            <Text className="font-semibold text-[15px] text-danger-text-color">
              Delete account
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <ActionSheet
        title="Profile photo"
        visible={sheet === 'photo'}
        actions={photoActions}
        onClose={closeSheet}
      />
      <DeleteAccountSheet visible={sheet === 'delete'} onClose={closeSheet} />
    </SafeAreaView>
  );
}

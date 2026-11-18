import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { z, type infer as TInfer } from 'zod';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { PasswordField } from '@/components/form/password-field';
import { notifySaveError } from '@/lib/forms/notify-save-error';
import { useDeleteAccountMutation } from '../../api/delete-account';
import { useTranslation } from 'react-i18next';

const DELETE_ACCOUNT_SCHEMA = z.object({
  password: z.string().min(1, 'validation.passwordRequired'),
});

interface IDeleteAccountForm extends TInfer<typeof DELETE_ACCOUNT_SCHEMA> {}

interface IDeleteAccountSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function DeleteAccountSheet({
  visible,
  onClose,
}: IDeleteAccountSheetProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const deleteAccount = useDeleteAccountMutation();
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm<IDeleteAccountForm>({
    resolver: zodResolver(DELETE_ACCOUNT_SCHEMA),
    defaultValues: { password: '' },
  });

  function close() {
    reset();
    onClose();
  }

  const onSubmit = async ({ password }: IDeleteAccountForm) => {
    try {
      await deleteAccount.mutateAsync(password);
      toast.success(t('account.delete.deleted'));
    } catch (error) {
      if (ApiError.from(error).is(EApiErrorCode.INVALID_CREDENTIALS)) {
        setError('password', { message: 'errors.wrongPassword' });
        return;
      }
      notifySaveError(error, 'account.delete.failed');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          accessibilityLabel={t('common.close')}
          onPress={close}
          className="flex-1 bg-overlay-bg-color/60"
        />
        <View
          className="gap-3 rounded-t-[22px] border-t border-primary-border-color bg-secondary-bg-color px-5 pt-2.5"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <View className="mb-1 h-1 w-10 self-center rounded-sm bg-secondary-border-color" />
          <Text
            accessibilityRole="header"
            className="font-semibold text-base text-primary-text-color"
          >
            {t('account.delete.title')}
          </Text>
          <Text className="font-sans text-sm leading-5 text-tertiary-text-color">
            {t('account.delete.body')}
          </Text>
          <PasswordField
            control={control}
            name="password"
            label={t('auth.password')}
            autoComplete="current-password"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
            disabled={isSubmitting}
            onPress={() => void handleSubmit(onSubmit)()}
            className="mt-1 h-[52px] items-center justify-center rounded-xl border border-danger-border-color bg-danger-soft-bg-color disabled:opacity-60"
          >
            <Text className="font-semibold text-[15px] text-danger-text-color">
              {isSubmitting
                ? t('account.delete.deleting')
                : t('account.delete.confirm')}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={close}
            className="h-[52px] items-center justify-center"
          >
            <Text className="font-semibold text-[15px] text-secondary-text-color">
              {t('common.cancel')}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { FormHeader } from '@/components/form-header';
import { PasswordField } from '@/components/form/password-field';
import { PasswordRules } from '@/components/form/password-rules';
import { applyApiErrors } from '@/lib/forms/apply-api-errors';
import { notifySaveError } from '@/lib/forms/notify-save-error';
import { goBackOr } from '@/lib/navigation';
import { ROUTES } from '@/routes/routes.constants';
import { useChangePasswordMutation } from '../api/patch-password';
import {
  ACCOUNT_PASSWORD_DEFAULT_VALUES,
  ACCOUNT_PASSWORD_FIELDS,
  ACCOUNT_PASSWORD_MESSAGES,
  ACCOUNT_PASSWORD_SCHEMA,
  type IAccountPasswordForm,
} from './constants/constants';
import { useTranslation } from 'react-i18next';

function close() {
  goBackOr(ROUTES.account);
}

export function AccountPasswordScreen() {
  const { t } = useTranslation();
  const changePassword = useChangePasswordMutation();
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<IAccountPasswordForm>({
    resolver: zodResolver(ACCOUNT_PASSWORD_SCHEMA),
    defaultValues: ACCOUNT_PASSWORD_DEFAULT_VALUES,
  });
  const newPassword = useWatch({ control, name: 'newPassword' });

  const onSubmit = async ({
    currentPassword,
    newPassword: password,
  }: IAccountPasswordForm) => {
    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword: password,
      });
      toast.success(t(ACCOUNT_PASSWORD_MESSAGES.changed));
      close();
    } catch (error) {
      if (ApiError.from(error).is(EApiErrorCode.INVALID_CREDENTIALS)) {
        setError('currentPassword', {
          message: ACCOUNT_PASSWORD_MESSAGES.wrongPassword,
        });
        return;
      }
      if (applyApiErrors(error, setError, ACCOUNT_PASSWORD_FIELDS)) {
        return;
      }
      notifySaveError(error, ACCOUNT_PASSWORD_MESSAGES.unexpected);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FormHeader
          title={t('account.password.title')}
          isSaving={isSubmitting}
          onCancel={close}
          onSave={() => void handleSubmit(onSubmit)()}
        />
        <ScrollView
          contentContainerClassName="gap-[18px] px-5 pb-10 pt-[18px]"
          keyboardShouldPersistTaps="handled"
        >
          <PasswordField
            control={control}
            name="currentPassword"
            label={t('account.password.current')}
            autoComplete="current-password"
          />
          <PasswordField
            control={control}
            name="newPassword"
            label={t('account.password.new')}
            autoComplete="new-password"
          />
          <PasswordRules password={newPassword} />
          <PasswordField
            control={control}
            name="confirmPassword"
            label={t('account.password.confirm')}
            autoComplete="new-password"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

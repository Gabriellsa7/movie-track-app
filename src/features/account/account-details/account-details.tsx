import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { FormHeader } from '@/components/form-header';
import { PasswordField } from '@/components/form/password-field';
import { TextField } from '@/components/form/text-field';
import { applyApiErrors } from '@/lib/forms/apply-api-errors';
import { notifySaveError } from '@/lib/forms/notify-save-error';
import { goBackOr } from '@/lib/navigation';
import { ROUTES } from '@/routes/routes.constants';
import { useSessionStore } from '@/stores/session.store';
import { useUpdateAccountMutation } from '../api/put-account';
import {
  ACCOUNT_DETAILS_FIELDS,
  ACCOUNT_DETAILS_MESSAGES,
  ACCOUNT_DETAILS_SCHEMA,
  accountDetailsDefaultValues,
  isEmailChanged,
  toUpdateUserBody,
  type IAccountDetailsForm,
} from './constants/constants';

function close() {
  goBackOr(ROUTES.account);
}

export function AccountDetailsScreen() {
  const user = useSessionStore((state) => state.user);
  const updateAccount = useUpdateAccountMutation();
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<IAccountDetailsForm>({
    resolver: zodResolver(ACCOUNT_DETAILS_SCHEMA),
    defaultValues: accountDetailsDefaultValues(user),
  });
  const email = useWatch({ control, name: 'email' });
  const emailChanged = isEmailChanged(email, user);

  const onSubmit = async (values: IAccountDetailsForm) => {
    if (emailChanged && !values.currentPassword) {
      setError('currentPassword', {
        message: ACCOUNT_DETAILS_MESSAGES.passwordRequired,
      });
      return;
    }
    try {
      await updateAccount.mutateAsync(toUpdateUserBody(values, user));
      toast.success(
        emailChanged
          ? ACCOUNT_DETAILS_MESSAGES.verifyNewEmail
          : ACCOUNT_DETAILS_MESSAGES.updated,
      );
      close();
    } catch (error) {
      const apiError = ApiError.from(error);
      if (apiError.is(EApiErrorCode.EMAIL_TAKEN)) {
        setError('email', { message: ACCOUNT_DETAILS_MESSAGES.emailTaken });
        return;
      }
      if (apiError.is(EApiErrorCode.INVALID_CREDENTIALS)) {
        setError('currentPassword', {
          message: ACCOUNT_DETAILS_MESSAGES.wrongPassword,
        });
        return;
      }
      if (apiError.is(EApiErrorCode.CURRENT_PASSWORD_REQUIRED)) {
        setError('currentPassword', {
          message: ACCOUNT_DETAILS_MESSAGES.passwordRequired,
        });
        return;
      }
      if (applyApiErrors(error, setError, ACCOUNT_DETAILS_FIELDS)) {
        return;
      }
      notifySaveError(error, ACCOUNT_DETAILS_MESSAGES.unexpected);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-bg-color">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FormHeader
          title="Name and e-mail"
          isSaving={isSubmitting}
          onCancel={close}
          onSave={() => void handleSubmit(onSubmit)()}
        />
        <ScrollView
          contentContainerClassName="gap-[18px] px-5 pb-10 pt-[18px]"
          keyboardShouldPersistTaps="handled"
        >
          <TextField
            control={control}
            name="name"
            label="Name"
            autoComplete="name"
          />
          <TextField
            control={control}
            name="email"
            label="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            hint={
              emailChanged
                ? 'We will send a link to confirm the new e-mail.'
                : undefined
            }
          />
          {emailChanged && (
            <PasswordField
              control={control}
              name="currentPassword"
              label="Current password"
              autoComplete="current-password"
              hint="Needed to change the e-mail"
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { z, type infer as TInfer } from 'zod';
import type { IUpdateUserBody, IUser } from '@/api/types';
import { emailSchema, nameSchema } from '@/lib/validation/rules';

export const ACCOUNT_DETAILS_SCHEMA = z.object({
  name: nameSchema,
  email: emailSchema,
  currentPassword: z.string(),
});

export interface IAccountDetailsForm extends TInfer<
  typeof ACCOUNT_DETAILS_SCHEMA
> {}

export const ACCOUNT_DETAILS_FIELDS = [
  'name',
  'email',
  'currentPassword',
] as const;

export const ACCOUNT_DETAILS_MESSAGES = {
  updated: 'Account updated',
  verifyNewEmail:
    'Account updated. Confirm the new e-mail with the link we sent.',
  emailTaken: 'This e-mail is already in use',
  wrongPassword: 'Wrong password',
  passwordRequired: 'Enter your password to change the e-mail',
  unexpected: "Couldn't save your account. Try again.",
} as const;

export function accountDetailsDefaultValues(
  user: IUser | null,
): IAccountDetailsForm {
  return {
    name: user?.name ?? '',
    email: user?.email ?? '',
    currentPassword: '',
  };
}

export function isEmailChanged(
  email: string,
  user: Pick<IUser, 'email'> | null,
): boolean {
  return email.trim().toLowerCase() !== (user?.email ?? '');
}

export function toUpdateUserBody(
  values: IAccountDetailsForm,
  user: Pick<IUser, 'email'> | null,
): IUpdateUserBody {
  return isEmailChanged(values.email, user)
    ? {
        name: values.name,
        email: values.email,
        currentPassword: values.currentPassword,
      }
    : { name: values.name };
}

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
  updated: 'account.details.updated',
  verifyNewEmail: 'account.details.verifyNewEmail',
  emailTaken: 'account.details.emailTaken',
  wrongPassword: 'errors.wrongPassword',
  passwordRequired: 'account.details.passwordRequired',
  unexpected: 'account.details.unexpected',
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

import { z, type infer as TInfer } from 'zod';
import { passwordSchema } from '@/lib/validation/rules';

export const ACCOUNT_PASSWORD_SCHEMA = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: "The passwords don't match",
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ['newPassword'],
    message: 'Use a password different from the current one',
  });

export interface IAccountPasswordForm extends TInfer<
  typeof ACCOUNT_PASSWORD_SCHEMA
> {}

export const ACCOUNT_PASSWORD_DEFAULT_VALUES: IAccountPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const ACCOUNT_PASSWORD_FIELDS = [
  'currentPassword',
  'newPassword',
] as const;

export const ACCOUNT_PASSWORD_MESSAGES = {
  changed: 'Password changed',
  wrongPassword: 'Wrong password',
  unexpected: "Couldn't change your password. Try again.",
} as const;

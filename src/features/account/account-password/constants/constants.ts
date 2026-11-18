import { z, type infer as TInfer } from 'zod';
import { passwordSchema } from '@/lib/validation/rules';

export const ACCOUNT_PASSWORD_SCHEMA = z
  .object({
    currentPassword: z.string().min(1, 'validation.currentPasswordRequired'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'validation.passwordsMatch',
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ['newPassword'],
    message: 'validation.passwordDifferent',
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
  changed: 'account.password.changed',
  wrongPassword: 'errors.wrongPassword',
  unexpected: 'account.password.unexpected',
} as const;

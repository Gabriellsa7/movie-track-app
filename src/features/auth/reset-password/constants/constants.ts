import { z, type infer as TInfer } from 'zod';
import { passwordSchema } from '@/lib/validation/rules';

export const RESET_PASSWORD_SCHEMA = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: "The passwords don't match",
  });

export interface IResetPasswordForm extends TInfer<
  typeof RESET_PASSWORD_SCHEMA
> {}

export const RESET_PASSWORD_MESSAGES = {
  changed: 'Password changed. Log in with the new one.',
  unexpected: "Couldn't save the new password. Try again.",
} as const;

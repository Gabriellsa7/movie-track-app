import { z, type infer as TInfer } from 'zod';
import { passwordSchema } from '@/lib/validation/rules';

export const RESET_PASSWORD_SCHEMA = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'validation.passwordsMatch',
  });

export interface IResetPasswordForm extends TInfer<
  typeof RESET_PASSWORD_SCHEMA
> {}

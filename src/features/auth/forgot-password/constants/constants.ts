import { z, type infer as TInfer } from 'zod';
import { emailSchema } from '@/lib/validation/rules';

export const FORGOT_PASSWORD_SCHEMA = z.object({ email: emailSchema });

export interface IForgotPasswordForm extends TInfer<
  typeof FORGOT_PASSWORD_SCHEMA
> {}

export const RESEND_WAIT_SECONDS = 60;

export const FORGOT_PASSWORD_MESSAGES = {
  unexpected: "Couldn't send the link. Try again.",
} as const;

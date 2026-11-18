import { emailSchema } from '@/lib/validation/rules';
import { z, type infer as TInfer } from 'zod';

export const LOGIN_SCHEMA = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password'),
});

export interface ILoginForm extends TInfer<typeof LOGIN_SCHEMA> {}

export const LOGIN_DEFAULT_VALUES: ILoginForm = {
  email: '',
  password: '',
};

export const LOGIN_ERROR_MESSAGES = {
  unexpected: "Couldn't log in. Try again.",
} as const;

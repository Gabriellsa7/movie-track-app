import { emailSchema } from '@/lib/validation/rules';
import { z } from 'zod';

export const LOGIN_SCHEMA = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe sua senha'),
});

export type TLoginForm = z.infer<typeof LOGIN_SCHEMA>;

export const LOGIN_DEFAULT_VALUES: TLoginForm = {
  email: '',
  password: '',
};

export const LOGIN_ERROR_MESSAGES = {
  invalidCredentials: 'E-mail ou senha incorretos',
  unexpected: 'Não foi possível entrar. Tente de novo.',
} as const;

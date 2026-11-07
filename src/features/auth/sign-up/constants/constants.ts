import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from '@/lib/validation/rules';
import { z } from 'zod';

export const SIGN_UP_SCHEMA = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type TSignUpForm = z.infer<typeof SIGN_UP_SCHEMA>;

export const SIGN_UP_FIELDS = ['name', 'email', 'password'] as const;

export const SIGN_UP_DEFAULT_VALUES: TSignUpForm = {
  name: '',
  email: '',
  password: '',
};

export const SIGN_UP_ERROR_MESSAGES = {
  unexpected: 'Não foi possível criar a conta. Tente de novo.',
} as const;

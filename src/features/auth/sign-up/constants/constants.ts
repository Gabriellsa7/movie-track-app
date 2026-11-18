import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from '@/lib/validation/rules';
import { z, type infer as TInfer } from 'zod';

export const SIGN_UP_SCHEMA = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export interface ISignUpForm extends TInfer<typeof SIGN_UP_SCHEMA> {}

export const SIGN_UP_FIELDS = ['name', 'email', 'password'] as const;

export const SIGN_UP_DEFAULT_VALUES: ISignUpForm = {
  name: '',
  email: '',
  password: '',
};

export const SIGN_UP_ERROR_MESSAGES = {
  unexpected: 'Não foi possível criar a conta. Tente de novo.',
} as const;

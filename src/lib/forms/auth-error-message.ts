import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';

const MESSAGES_BY_CODE: Partial<Record<EApiErrorCode, string>> = {
  [EApiErrorCode.INVALID_CREDENTIALS]: 'Wrong e-mail or password',
  [EApiErrorCode.EMAIL_TAKEN]: 'This e-mail already has an account',
  [EApiErrorCode.TOO_MANY_ATTEMPTS]:
    'Too many attempts. Wait a few minutes and try again.',
  [EApiErrorCode.TOO_MANY_REQUESTS]:
    'Too many attempts. Wait a few minutes and try again.',
  [EApiErrorCode.NETWORK_ERROR]:
    "Can't reach the server. Check your connection and try again.",
  [EApiErrorCode.SERVICE_UNAVAILABLE]:
    'Service unavailable right now. Try again in a moment.',
};

const FIELD_LABELS: Record<string, string> = {
  name: 'Invalid name',
  email: 'Invalid e-mail',
  password: 'Invalid password',
};

export function authErrorMessage(error: unknown, fallback: string): string {
  const apiError = ApiError.from(error);

  if (apiError.is(EApiErrorCode.VALIDATION_ERROR)) {
    const label = apiError.fieldErrors
      .map(({ field }) => FIELD_LABELS[field.split(/[./]/)[0] ?? field])
      .find(Boolean);
    if (label) {
      return label;
    }
  }
  return MESSAGES_BY_CODE[apiError.code as EApiErrorCode] ?? fallback;
}

import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { i18n } from '@/i18n';
import { translateMessage } from '@/i18n/message';

const MESSAGE_KEYS = {
  [EApiErrorCode.INVALID_CREDENTIALS]: 'errors.wrongCredentials',
  [EApiErrorCode.EMAIL_TAKEN]: 'errors.emailHasAccount',
  [EApiErrorCode.TOO_MANY_ATTEMPTS]: 'errors.tooManyAttempts',
  [EApiErrorCode.TOO_MANY_REQUESTS]: 'errors.tooManyAttempts',
  [EApiErrorCode.NETWORK_ERROR]: 'errors.noConnection',
  [EApiErrorCode.SERVICE_UNAVAILABLE]: 'errors.serviceUnavailable',
} as const;

const FIELD_KEYS = {
  name: 'errors.invalidName',
  email: 'errors.invalidEmail',
  password: 'errors.invalidPassword',
} as const;

function isKnownCode(code: string): code is keyof typeof MESSAGE_KEYS {
  return code in MESSAGE_KEYS;
}

function isKnownField(field: string): field is keyof typeof FIELD_KEYS {
  return field in FIELD_KEYS;
}

export function authErrorMessage(error: unknown, fallback: string): string {
  const apiError = ApiError.from(error);

  if (apiError.is(EApiErrorCode.VALIDATION_ERROR)) {
    const field = apiError.fieldErrors
      .map(({ field: path }) => path.split(/[./]/)[0] ?? path)
      .find(isKnownField);
    if (field) {
      return i18n.t(FIELD_KEYS[field]);
    }
  }
  return isKnownCode(apiError.code)
    ? i18n.t(MESSAGE_KEYS[apiError.code])
    : translateMessage(fallback);
}

import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';

const MESSAGES_BY_CODE: Partial<Record<EApiErrorCode, string>> = {
  // The API answers the same for an unknown e-mail and a wrong password, so accounts can't be probed.
  [EApiErrorCode.INVALID_CREDENTIALS]: 'E-mail ou senha incorretos',
  [EApiErrorCode.EMAIL_TAKEN]: 'Este e-mail já tem uma conta',
  [EApiErrorCode.TOO_MANY_ATTEMPTS]:
    'Muitas tentativas. Espere alguns minutos e tente de novo.',
  [EApiErrorCode.TOO_MANY_REQUESTS]:
    'Muitas tentativas. Espere alguns minutos e tente de novo.',
  [EApiErrorCode.NETWORK_ERROR]:
    'Sem conexão com o servidor. Verifique sua internet e tente de novo.',
  [EApiErrorCode.SERVICE_UNAVAILABLE]:
    'Serviço indisponível no momento. Tente de novo em instantes.',
};

const FIELD_LABELS: Record<string, string> = {
  name: 'Nome inválido',
  email: 'E-mail inválido',
  password: 'Senha inválida',
};

/** The message the auth screens show in a toast for a failed request. */
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

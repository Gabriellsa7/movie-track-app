import { AxiosError } from 'axios';
import { ApiError } from '@/api/api-error';
import { authErrorMessage } from './auth-error-message';

const FALLBACK = 'Algo deu errado';

function apiError(status: number, code: string, field?: string) {
  return new ApiError({
    message: code,
    status,
    code,
    ...(field && { errors: [{ field, message: 'invalid' }] }),
  });
}

describe('When we explain a failed auth request', () => {
  it.each([
    [apiError(401, 'INVALID_CREDENTIALS'), 'E-mail ou senha incorretos'],
    [apiError(409, 'EMAIL_TAKEN'), 'Este e-mail já tem uma conta'],
    [
      apiError(429, 'TOO_MANY_ATTEMPTS'),
      'Muitas tentativas. Espere alguns minutos e tente de novo.',
    ],
    [
      apiError(503, 'SERVICE_UNAVAILABLE'),
      'Serviço indisponível no momento. Tente de novo em instantes.',
    ],
    [apiError(400, 'VALIDATION_ERROR', 'name'), 'Nome inválido'],
    [apiError(400, 'VALIDATION_ERROR', 'email'), 'E-mail inválido'],
    [apiError(400, 'VALIDATION_ERROR', 'password'), 'Senha inválida'],
    [apiError(500, 'INTERNAL_ERROR'), FALLBACK],
  ])('should map %p to its message', (error, message) => {
    expect(authErrorMessage(error, FALLBACK)).toBe(message);
  });

  it('should say there is no connection when the request got no answer', () => {
    expect(authErrorMessage(new AxiosError('Network Error'), FALLBACK)).toBe(
      'Sem conexão com o servidor. Verifique sua internet e tente de novo.',
    );
  });
});

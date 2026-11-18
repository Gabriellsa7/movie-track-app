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
    [apiError(401, 'INVALID_CREDENTIALS'), 'Wrong e-mail or password'],
    [apiError(409, 'EMAIL_TAKEN'), 'This e-mail already has an account'],
    [
      apiError(429, 'TOO_MANY_ATTEMPTS'),
      'Too many attempts. Wait a few minutes and try again.',
    ],
    [
      apiError(503, 'SERVICE_UNAVAILABLE'),
      'Service unavailable right now. Try again in a moment.',
    ],
    [apiError(400, 'VALIDATION_ERROR', 'name'), 'Invalid name'],
    [apiError(400, 'VALIDATION_ERROR', 'email'), 'Invalid e-mail'],
    [apiError(400, 'VALIDATION_ERROR', 'password'), 'Invalid password'],
    [apiError(500, 'INTERNAL_ERROR'), FALLBACK],
  ])('should map %p to its message', (error, message) => {
    expect(authErrorMessage(error, FALLBACK)).toBe(message);
  });

  it('should say there is no connection when the request got no answer', () => {
    expect(authErrorMessage(new AxiosError('Network Error'), FALLBACK)).toBe(
      "Can't reach the server. Check your connection and try again.",
    );
  });
});

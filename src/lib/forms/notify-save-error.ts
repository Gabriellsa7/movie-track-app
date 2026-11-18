import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';

export const NO_CONNECTION_MESSAGE =
  "Can't reach the server. Check your connection and try again.";

export function notifySaveError(error: unknown, fallbackMessage: string) {
  const apiError = ApiError.from(error);
  if (apiError.is(EApiErrorCode.SERVICE_UNAVAILABLE)) {
    return;
  }
  toast.error(
    apiError.is(EApiErrorCode.NETWORK_ERROR)
      ? NO_CONNECTION_MESSAGE
      : fallbackMessage,
  );
}

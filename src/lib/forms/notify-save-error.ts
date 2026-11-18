import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { i18n } from '@/i18n';
import { translateMessage } from '@/i18n/message';

export function notifySaveError(error: unknown, fallbackMessage: string) {
  const apiError = ApiError.from(error);
  if (apiError.is(EApiErrorCode.SERVICE_UNAVAILABLE)) {
    return;
  }
  toast.error(
    apiError.is(EApiErrorCode.NETWORK_ERROR)
      ? i18n.t('errors.noConnection')
      : translateMessage(fallbackMessage),
  );
}

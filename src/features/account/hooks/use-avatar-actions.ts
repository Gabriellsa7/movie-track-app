import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { notifySaveError } from '@/lib/forms/notify-save-error';
import { pickImage } from '@/lib/pick-image';
import { useRemoveAvatarMutation } from '../api/delete-avatar';
import { useUploadAvatarMutation } from '../api/put-avatar';
import { translateMessage } from '@/i18n/message';
import { i18n } from '@/i18n';

const AVATAR_ASPECT: [number, number] = [1, 1];

export function useAvatarActions() {
  const uploadAvatar = useUploadAvatarMutation();
  const removeAvatar = useRemoveAvatarMutation();

  async function choose() {
    const result = await pickImage(AVATAR_ASPECT);
    if (result.status === 'invalid') {
      toast.error(translateMessage(result.message));
      return;
    }
    if (result.status !== 'picked') {
      return;
    }
    uploadAvatar.mutate(result.file, {
      onSuccess: () => {
        toast.success(i18n.t('account.photo.updated'));
      },
      onError: (error) => {
        if (ApiError.from(error).is(EApiErrorCode.INVALID_AVATAR_TYPE)) {
          toast.error(i18n.t('account.photo.invalidType'));
          return;
        }
        notifySaveError(error, 'account.photo.updateFailed');
      },
    });
  }

  function remove() {
    removeAvatar.mutate(undefined, {
      onSuccess: () => {
        toast.success(i18n.t('account.photo.removed'));
      },
      onError: (error) => {
        notifySaveError(error, 'account.photo.removeFailed');
      },
    });
  }

  return {
    choose,
    remove,
    isSaving: uploadAvatar.isPending || removeAvatar.isPending,
  };
}

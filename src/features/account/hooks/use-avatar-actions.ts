import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { notifySaveError } from '@/lib/forms/notify-save-error';
import { pickImage } from '@/lib/pick-image';
import { useRemoveAvatarMutation } from '../api/delete-avatar';
import { useUploadAvatarMutation } from '../api/put-avatar';

const AVATAR_ASPECT: [number, number] = [1, 1];

export function useAvatarActions() {
  const uploadAvatar = useUploadAvatarMutation();
  const removeAvatar = useRemoveAvatarMutation();

  async function choose() {
    const result = await pickImage(AVATAR_ASPECT);
    if (result.status === 'invalid') {
      toast.error(result.message);
      return;
    }
    if (result.status !== 'picked') {
      return;
    }
    uploadAvatar.mutate(result.file, {
      onSuccess: () => {
        toast.success('Photo updated');
      },
      onError: (error) => {
        if (ApiError.from(error).is(EApiErrorCode.INVALID_AVATAR_TYPE)) {
          toast.error('Use a JPEG, PNG or WebP image.');
          return;
        }
        notifySaveError(error, "Couldn't update your photo. Try again.");
      },
    });
  }

  function remove() {
    removeAvatar.mutate(undefined, {
      onSuccess: () => {
        toast.success('Photo removed');
      },
      onError: (error) => {
        notifySaveError(error, "Couldn't remove your photo. Try again.");
      },
    });
  }

  return {
    choose,
    remove,
    isSaving: uploadAvatar.isPending || removeAvatar.isPending,
  };
}

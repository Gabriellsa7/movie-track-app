import { apiClient } from '@/api/client';
import type { TUser } from '@/api/types';
import { toFormData, type IUploadFile } from '@/api/upload-file';
import { useAccountMutation } from './account-mutation';

export async function uploadAvatar(
  userId: string,
  avatar: IUploadFile,
): Promise<TUser> {
  const { data } = await apiClient.put<TUser>(
    `/users/${userId}/avatar`,
    toFormData('avatar', avatar),
  );
  return data;
}

export function useUploadAvatarMutation() {
  return useAccountMutation(uploadAvatar);
}

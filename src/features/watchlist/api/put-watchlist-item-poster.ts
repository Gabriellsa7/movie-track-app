import { apiClient } from '@/api/client';
import type { IWatchlistItem } from '@/api/types';
import { toFormData, type IUploadFile } from '@/api/upload-file';

export async function uploadWatchlistItemPoster(
  itemId: string,
  poster: IUploadFile,
): Promise<IWatchlistItem> {
  const { data } = await apiClient.put<IWatchlistItem>(
    `/watchlist/${itemId}/poster`,
    toFormData('poster', poster),
  );
  return data;
}

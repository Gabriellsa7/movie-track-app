import * as ImagePicker from 'expo-image-picker';
import type { IUploadFile } from '@/api/upload-file';
import { imageAssetSchema } from '@/lib/validation/rules';

export type TPickImageResult =
  | { status: 'picked'; file: IUploadFile }
  | { status: 'cancelled' }
  | { status: 'invalid'; message: string };

const DEFAULT_MIME_TYPE = 'image/jpeg';

// Picks one image for the avatar (square) or a poster (2:3) and checks it like the API does.
export async function pickImage(
  aspect: [number, number],
): Promise<TPickImageResult> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsEditing: true,
    aspect,
    quality: 0.85,
  });
  const asset = result.canceled ? undefined : result.assets[0];
  if (!asset) {
    return { status: 'cancelled' };
  }

  const checked = imageAssetSchema.safeParse(asset);
  if (!checked.success) {
    return {
      status: 'invalid',
      message: checked.error.issues[0]?.message ?? 'Imagem inválida',
    };
  }

  const type = asset.mimeType ?? DEFAULT_MIME_TYPE;
  return {
    status: 'picked',
    file: {
      uri: asset.uri,
      name: asset.fileName ?? `image.${type.split('/')[1] ?? 'jpg'}`,
      type,
    },
  };
}

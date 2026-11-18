import { ImagePlus, Trash2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { toast } from 'sonner-native';
import type { IUploadFile } from '@/api/upload-file';
import { Poster } from '@/components/poster';
import { pickImage } from '@/lib/pick-image';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';

const POSTER_ASPECT: [number, number] = [2, 3];

interface IPosterPickerProps {
  title: string;
  photo: IUploadFile | undefined;
  posterUrl: string | undefined;
  onPick: (photo: IUploadFile) => void;
  onRemove: () => void;
}

export function PosterPicker({
  title,
  photo,
  posterUrl,
  onPick,
  onRemove,
}: IPosterPickerProps) {
  const scheme = useAppTheme();
  const previewUrl = photo?.uri ?? posterUrl;

  async function choose() {
    const result = await pickImage(POSTER_ASPECT);
    if (result.status === 'picked') {
      onPick(result.file);
    } else if (result.status === 'invalid') {
      toast.error(result.message);
    }
  }

  return (
    <View className="gap-1.5">
      <Text className="font-semibold text-sm text-primary-text-color">
        Capa
      </Text>
      <View className="flex-row items-end gap-4">
        <Poster
          title={title || 'Sem capa'}
          posterUrl={previewUrl}
          className="h-[150px] w-[100px] rounded-[10px]"
        />
        <View className="flex-1 gap-2">
          <Pressable
            accessibilityRole="button"
            onPress={() => void choose()}
            className="h-11 flex-row items-center justify-center gap-2 rounded-xl border border-primary-border-color bg-secondary-bg-color"
          >
            <ImagePlus size={18} color={color(scheme, 'primary-text-color')} />
            <Text className="font-semibold text-sm text-primary-text-color">
              {photo ? 'Trocar foto' : 'Escolher foto'}
            </Text>
          </Pressable>
          {previewUrl && (
            <Pressable
              accessibilityRole="button"
              onPress={onRemove}
              className="h-11 flex-row items-center justify-center gap-2"
            >
              <Trash2 size={18} color={color(scheme, 'danger-text-color')} />
              <Text className="font-semibold text-sm text-danger-text-color">
                Remover capa
              </Text>
            </Pressable>
          )}
          <Text className="font-sans text-xs text-tertiary-text-color">
            {photo
              ? 'Foto do celular'
              : posterUrl
                ? 'Capa do TMDB'
                : 'Opcional · JPEG, PNG ou WebP até 5 MB'}
          </Text>
        </View>
      </View>
    </View>
  );
}

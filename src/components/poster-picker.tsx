import { ImagePlus, Trash2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { toast } from 'sonner-native';
import type { IUploadFile } from '@/api/upload-file';
import { Poster } from '@/components/poster';
import { pickImage } from '@/lib/pick-image';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { useTranslation } from 'react-i18next';
import { translateMessage } from '@/i18n/message';

const POSTER_ASPECT: [number, number] = [2, 3];

interface IPosterPickerProps {
  title: string;
  photo: IUploadFile | undefined;
  posterUrl: string | undefined;
  posterUrlLabel?: string;
  onPick: (photo: IUploadFile) => void;
  onRemove: () => void;
}

export function PosterPicker({
  title,
  photo,
  posterUrl,
  posterUrlLabel,
  onPick,
  onRemove,
}: IPosterPickerProps) {
  const scheme = useAppTheme();
  const { t } = useTranslation();
  const previewUrl = photo?.uri ?? posterUrl;

  async function choose() {
    const result = await pickImage(POSTER_ASPECT);
    if (result.status === 'picked') {
      onPick(result.file);
    } else if (result.status === 'invalid') {
      toast.error(translateMessage(result.message));
    }
  }

  return (
    <View className="gap-1.5">
      <Text className="font-semibold text-sm text-primary-text-color">
        {t('common.poster.label')}
      </Text>
      <View className="flex-row items-end gap-4">
        <Poster
          title={title || t('common.poster.none')}
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
              {photo ? t('common.poster.change') : t('common.poster.choose')}
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
                {t('common.poster.remove')}
              </Text>
            </Pressable>
          )}
          <Text className="font-sans text-xs text-tertiary-text-color">
            {photo
              ? t('common.poster.fromPhone')
              : posterUrl
                ? (posterUrlLabel ?? t('common.poster.fromTmdb'))
                : t('common.poster.optional')}
          </Text>
        </View>
      </View>
    </View>
  );
}

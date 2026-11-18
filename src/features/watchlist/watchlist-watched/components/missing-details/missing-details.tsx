import type { Control } from 'react-hook-form';
import { Text, View } from 'react-native';
import { GenrePicker } from '@/components/form/genre-picker';
import { TextAreaField } from '@/components/form/text-area-field';
import { TextField } from '@/components/form/text-field';
import type {
  IWatchedInput,
  IWatchedOutput,
  TMissingField,
} from '../../constants/constants';
import { useTranslation } from 'react-i18next';

interface IMissingDetailsProps {
  control: Control<IWatchedInput, unknown, IWatchedOutput>;
  missing: TMissingField[];
}

export function MissingDetails({ control, missing }: IMissingDetailsProps) {
  const { t } = useTranslation();
  return (
    <View
      accessibilityRole="alert"
      className="gap-3 rounded-xl border border-accent-border-color bg-accent-soft-bg-color p-3.5"
    >
      <Text className="font-sans text-[13px] leading-5 text-primary-text-color">
        <Text className="font-semibold text-accent-text-color">
          {t('watchlist.watched.missingTitle')}
        </Text>{' '}
        {t('watchlist.watched.missingHint')}
      </Text>
      {missing.includes('releaseYear') && (
        <TextField
          control={control}
          name="releaseYear"
          label={t('watchlist.watched.year')}
          placeholder="2023"
          keyboardType="number-pad"
          maxLength={4}
        />
      )}
      {missing.includes('genreIds') && (
        <GenrePicker
          control={control}
          name="genreIds"
          label={t('watchlist.watched.genres')}
        />
      )}
      {missing.includes('synopsis') && (
        <TextAreaField
          control={control}
          name="synopsis"
          label={t('watchlist.watched.synopsis')}
          placeholder={t('watchlist.watched.synopsisPlaceholder')}
        />
      )}
    </View>
  );
}

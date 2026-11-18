import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import type { ITmdbMovie, IWatchlistItem } from '@/api/types';
import { GenrePicker } from '@/components/form/genre-picker';
import { TextAreaField } from '@/components/form/text-area-field';
import { TextField } from '@/components/form/text-field';
import { TmdbSearch } from '@/components/tmdb-search';
import { applyApiErrors } from '@/lib/forms/apply-api-errors';
import { notifySaveError } from '@/lib/forms/notify-save-error';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { color } from '@/theme/palette';
import { useAddWatchlistItemMutation } from '../../../api/post-watchlist-item';
import { useUpdateWatchlistItemMutation } from '../../../api/put-watchlist-item';
import {
  ITEM_DETAIL_FIELDS,
  ITEM_FORM_FIELDS,
  ITEM_FORM_SCHEMA,
  itemFormDefaultValues,
  toNewItemBody,
  toUpdateItemBody,
  type IItemFormInput,
  type IItemFormOutput,
} from '../../constants/constants';
import {
  closeItemForm,
  ItemFormHeader,
} from '../item-form-header/item-form-header';
import { PlannedDateField } from '../planned-date-field/planned-date-field';
import { PrioritySelect } from '../priority-select/priority-select';
import { SelectedMovieCard } from '../selected-movie-card/selected-movie-card';

const DUPLICATE_MESSAGES: Partial<Record<string, string>> = {
  [EApiErrorCode.ALREADY_IN_WATCHLIST]:
    'This movie is already on your watchlist.',
  [EApiErrorCode.MOVIE_ALREADY_LOGGED]: "You've already watched this movie.",
};

export function ItemForm({ item }: { item?: IWatchlistItem }) {
  const scheme = useAppTheme();
  const isEditing = item !== undefined;
  const addItem = useAddWatchlistItemMutation();
  const updateItem = useUpdateWatchlistItemMutation(item?.id ?? '');
  const [showDetails, setShowDetails] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { isSubmitting },
  } = useForm<IItemFormInput, unknown, IItemFormOutput>({
    resolver: zodResolver(ITEM_FORM_SCHEMA),
    defaultValues: itemFormDefaultValues(item),
  });
  const [title, releaseYear, genreIds, tmdbId, posterUrl] = useWatch({
    control,
    name: ['title', 'releaseYear', 'genreIds', 'tmdbId', 'posterUrl'],
  });
  const hasMovie = tmdbId !== undefined;

  function fillFromTmdb(movie: ITmdbMovie) {
    const options = { shouldDirty: true };
    setValue('title', movie.title, options);
    setValue(
      'releaseYear',
      movie.releaseYear ? String(movie.releaseYear) : '',
      options,
    );
    setValue('synopsis', movie.synopsis ?? '', options);
    setValue('genreIds', movie.genreIds, options);
    setValue('tmdbId', movie.tmdbId, options);
    setValue('posterUrl', movie.posterUrl, options);
    clearErrors(['title', ...ITEM_DETAIL_FIELDS]);
  }

  function changeMovie() {
    setValue('tmdbId', undefined);
    setValue('posterUrl', undefined);
  }

  const onSubmit = async (values: IItemFormOutput) => {
    try {
      if (isEditing) {
        await updateItem.mutateAsync(toUpdateItemBody(values));
        toast.success('Watchlist item updated');
      } else {
        await addItem.mutateAsync(toNewItemBody(values));
        toast.success('Added to your watchlist');
      }
      closeItemForm();
    } catch (error) {
      if (applyApiErrors(error, setError, ITEM_FORM_FIELDS)) {
        setShowDetails(true);
        return;
      }
      const duplicate = DUPLICATE_MESSAGES[ApiError.from(error).code];
      if (duplicate) {
        toast.error(duplicate);
        return;
      }
      notifySaveError(error, "Couldn't save it. Try again.");
    }
  };

  const save = handleSubmit(onSubmit, (errors) => {
    if (ITEM_DETAIL_FIELDS.some((field) => field in errors)) {
      setShowDetails(true);
    }
  });

  return (
    <View className="flex-1">
      <ItemFormHeader
        title={isEditing ? 'Edit item' : 'Add to watchlist'}
        saveLabel={isEditing ? 'Save' : 'Add'}
        isSaving={isSubmitting}
        onSave={() => void save()}
      />
      <ScrollView
        contentContainerClassName="gap-5 px-5 pb-10 pt-[18px]"
        keyboardShouldPersistTaps="handled"
      >
        {hasMovie ? (
          <SelectedMovieCard
            title={title}
            releaseYear={releaseYear}
            genreIds={genreIds}
            posterUrl={posterUrl}
            onChange={changeMovie}
          />
        ) : (
          <View className="gap-4">
            <TmdbSearch placeholder="Search TMDB" onSelect={fillFromTmdb} />
            <TextField control={control} name="title" label="Title" />
          </View>
        )}

        <PrioritySelect control={control} />
        <PlannedDateField control={control} />
        <TextAreaField
          control={control}
          name="note"
          label="Personal note"
          placeholder="Who recommended it, when to watch…"
        />

        <View className="rounded-[10px] border border-primary-border-color px-3.5">
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: showDetails }}
            onPress={() => {
              setShowDetails((open) => !open);
            }}
            className="h-11 flex-row items-center justify-between"
          >
            <Text className="font-semibold text-[13px] text-secondary-text-color">
              {hasMovie ? 'Movie details (filled by TMDB)' : 'Movie details'}
            </Text>
            {showDetails ? (
              <ChevronUp
                size={18}
                color={color(scheme, 'secondary-text-color')}
              />
            ) : (
              <ChevronDown
                size={18}
                color={color(scheme, 'secondary-text-color')}
              />
            )}
          </Pressable>
          {showDetails && (
            <View className="gap-4 pb-4">
              <TextField
                control={control}
                name="releaseYear"
                label="Release year"
                keyboardType="number-pad"
                maxLength={4}
              />
              <GenrePicker control={control} name="genreIds" label="Genres" />
              <TextAreaField
                control={control}
                name="synopsis"
                label="Synopsis"
              />
              <TextField control={control} name="director" label="Director" />
              <TextField
                control={control}
                name="durationMinutes"
                label="Runtime (minutes)"
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { useFetchTmdbDetailsValues } from '@/api/get-tmdb-movie-details';
import { useInvalidateWatchlist } from '@/api/get-watchlist';
import type { ITmdbMovie, IWatchlistItem } from '@/api/types';
import { GenrePicker } from '@/components/form/genre-picker';
import { TextAreaField } from '@/components/form/text-area-field';
import { TextField } from '@/components/form/text-field';
import { MovieSummaryCard } from '@/components/movie-summary-card';
import { PosterPicker } from '@/components/poster-picker';
import { TmdbSearch } from '@/components/tmdb-search';
import { applyApiErrors } from '@/lib/forms/apply-api-errors';
import { notifySaveError } from '@/lib/forms/notify-save-error';
import { MOVIE_DETAIL_FIELDS } from '@/lib/validation/movie-details';
import { useAddWatchlistItemMutation } from '../../../api/post-watchlist-item';
import { useUpdateWatchlistItemMutation } from '../../../api/put-watchlist-item';
import { uploadWatchlistItemPoster } from '../../../api/put-watchlist-item-poster';
import {
  isItemComplete,
  ITEM_FORM_FIELDS,
  ITEM_FORM_MESSAGES,
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
import { ItemFormFooter } from '../item-form-footer/item-form-footer';
import { PlannedDateField } from '../planned-date-field/planned-date-field';
import { PrioritySelect } from '../priority-select/priority-select';

const DUPLICATE_MESSAGES: Partial<Record<string, string>> = {
  [EApiErrorCode.ALREADY_IN_WATCHLIST]:
    'This movie is already on your watchlist.',
  [EApiErrorCode.MOVIE_ALREADY_LOGGED]: "You've already watched this movie.",
};

export function ItemForm({ item }: { item?: IWatchlistItem }) {
  const isEditing = item !== undefined;
  const addItem = useAddWatchlistItemMutation();
  const updateItem = useUpdateWatchlistItemMutation(item?.id ?? '');
  const invalidateWatchlist = useInvalidateWatchlist();
  const fetchTmdbDetails = useFetchTmdbDetailsValues();
  const [isEditingDetails, setIsEditingDetails] = useState(
    () => isEditing && !isItemComplete(item),
  );
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    setValue,
    clearErrors,
    formState: { isSubmitting },
  } = useForm<IItemFormInput, unknown, IItemFormOutput>({
    resolver: zodResolver(ITEM_FORM_SCHEMA),
    defaultValues: itemFormDefaultValues(item),
  });
  const [
    title,
    releaseYear,
    genreIds,
    director,
    durationMinutes,
    tmdbId,
    poster,
    posterUrl,
  ] = useWatch({
    control,
    name: [
      'title',
      'releaseYear',
      'genreIds',
      'director',
      'durationMinutes',
      'tmdbId',
      'poster',
      'posterUrl',
    ],
  });
  const showSummary = tmdbId !== undefined && !isEditingDetails;

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
    setValue('director', '', options);
    setValue('durationMinutes', '', options);
    setValue('tmdbId', movie.tmdbId, options);
    setValue('posterUrl', movie.posterUrl, options);
    setValue('poster', undefined);
    clearErrors(MOVIE_DETAIL_FIELDS);
    setIsEditingDetails(false);
    void fillTmdbDetails(movie.tmdbId);
  }

  async function fillTmdbDetails(movieTmdbId: number) {
    const details = await fetchTmdbDetails(movieTmdbId);
    if (!details || getValues('tmdbId') !== movieTmdbId) {
      return;
    }
    setValue('director', details.director, { shouldDirty: true });
    setValue('durationMinutes', details.durationMinutes, { shouldDirty: true });
  }

  function removePoster() {
    setValue('poster', undefined);
    setValue('posterUrl', undefined);
  }

  async function sendPoster(itemId: string, photo: IItemFormOutput['poster']) {
    if (!photo) {
      return true;
    }
    try {
      await uploadWatchlistItemPoster(itemId, photo);
      await invalidateWatchlist();
      return true;
    } catch {
      toast.error(ITEM_FORM_MESSAGES.posterNotSent);
      return false;
    }
  }

  const onSubmit = async (values: IItemFormOutput) => {
    try {
      const saved = isEditing
        ? await updateItem.mutateAsync(toUpdateItemBody(values))
        : await addItem.mutateAsync(toNewItemBody(values));
      if (await sendPoster(saved.id, values.poster)) {
        toast.success(
          isEditing ? ITEM_FORM_MESSAGES.updated : ITEM_FORM_MESSAGES.added,
        );
      }
      closeItemForm();
    } catch (error) {
      if (applyApiErrors(error, setError, ITEM_FORM_FIELDS)) {
        setIsEditingDetails(true);
        return;
      }
      const duplicate = DUPLICATE_MESSAGES[ApiError.from(error).code];
      if (duplicate) {
        toast.error(duplicate);
        return;
      }
      notifySaveError(error, ITEM_FORM_MESSAGES.unexpected);
    }
  };

  const save = handleSubmit(onSubmit, (errors) => {
    if (MOVIE_DETAIL_FIELDS.some((field) => field in errors)) {
      setIsEditingDetails(true);
    }
  });

  return (
    <View className="flex-1">
      <ItemFormHeader title={isEditing ? 'Edit item' : 'Add to watchlist'} />
      <ScrollView
        contentContainerClassName="gap-[18px] px-5 pb-10 pt-[18px]"
        keyboardShouldPersistTaps="handled"
      >
        <TmdbSearch
          placeholder={
            tmdbId === undefined ? 'Search TMDB' : 'Search another movie'
          }
          onSelect={fillFromTmdb}
        />

        {showSummary ? (
          <MovieSummaryCard
            title={title}
            releaseYear={releaseYear}
            genreIds={genreIds}
            director={director}
            durationMinutes={durationMinutes}
            posterUrl={poster?.uri ?? posterUrl}
            onEdit={() => {
              setIsEditingDetails(true);
            }}
          />
        ) : (
          <View className="gap-[18px]">
            <PosterPicker
              title={title}
              photo={poster}
              posterUrl={posterUrl}
              posterUrlLabel={
                posterUrl === item?.posterUrl ? 'Current poster' : undefined
              }
              onPick={(photo) => {
                setValue('poster', photo);
              }}
              onRemove={removePoster}
            />
            <TextField control={control} name="title" label="Title" />
            <TextField
              control={control}
              name="releaseYear"
              label="Release year"
              keyboardType="number-pad"
              maxLength={4}
            />
            <GenrePicker control={control} name="genreIds" label="Genres" />
            <TextAreaField control={control} name="synopsis" label="Synopsis" />
            <TextField
              control={control}
              name="director"
              label="Director"
              hint="Optional"
            />
            <TextField
              control={control}
              name="durationMinutes"
              label="Runtime (minutes)"
              hint="Optional"
              keyboardType="number-pad"
              maxLength={4}
            />
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
      </ScrollView>
      <ItemFormFooter
        label={isEditing ? 'Save' : 'Add'}
        isSaving={isSubmitting}
        onSave={() => void save()}
      />
    </View>
  );
}

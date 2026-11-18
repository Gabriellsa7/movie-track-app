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
import { useTranslation } from 'react-i18next';
import { translateMessage } from '@/i18n/message';

const DUPLICATE_MESSAGES: Partial<Record<string, string>> = {
  [EApiErrorCode.ALREADY_IN_WATCHLIST]: 'watchlist.form.alreadyInWatchlist',
  [EApiErrorCode.MOVIE_ALREADY_LOGGED]: 'watchlist.form.alreadyWatched',
};

export function ItemForm({ item }: { item?: IWatchlistItem }) {
  const { t } = useTranslation();
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
      toast.error(t(ITEM_FORM_MESSAGES.posterNotSent));
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
          t(isEditing ? ITEM_FORM_MESSAGES.updated : ITEM_FORM_MESSAGES.added),
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
        toast.error(translateMessage(duplicate));
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
      <ItemFormHeader
        title={
          isEditing
            ? t('watchlist.form.editTitle')
            : t('watchlist.form.addTitle')
        }
      />
      <ScrollView
        contentContainerClassName="gap-[18px] px-5 pb-10 pt-[18px]"
        keyboardShouldPersistTaps="handled"
      >
        <TmdbSearch
          placeholder={
            tmdbId === undefined
              ? t('movies.form.searchTmdb')
              : t('movies.form.searchAnother')
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
                posterUrl === item?.posterUrl
                  ? t('movies.form.currentPoster')
                  : undefined
              }
              onPick={(photo) => {
                setValue('poster', photo);
              }}
              onRemove={removePoster}
            />
            <TextField
              control={control}
              name="title"
              label={t('movies.form.title')}
            />
            <TextField
              control={control}
              name="releaseYear"
              label={t('movies.form.releaseYear')}
              keyboardType="number-pad"
              maxLength={4}
            />
            <GenrePicker
              control={control}
              name="genreIds"
              label={t('movies.form.genres')}
            />
            <TextAreaField
              control={control}
              name="synopsis"
              label={t('movies.form.synopsis')}
            />
            <TextField
              control={control}
              name="director"
              label={t('movies.form.director')}
              hint={t('movies.form.optional')}
            />
            <TextField
              control={control}
              name="durationMinutes"
              label={t('movies.form.runtime')}
              hint={t('movies.form.optional')}
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
          label={t('watchlist.form.personalNote')}
          placeholder={t('watchlist.form.notePlaceholder')}
        />
      </ScrollView>
      <ItemFormFooter
        label={isEditing ? t('watchlist.form.save') : t('watchlist.form.add')}
        isSaving={isSubmitting}
        onSave={() => void save()}
      />
    </View>
  );
}

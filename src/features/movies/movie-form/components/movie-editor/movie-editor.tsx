import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ScrollView, Switch, Text, View } from 'react-native';
import { toast } from 'sonner-native';
import { useInvalidateMyMovies } from '@/api/get-movies';
import { useFetchTmdbDetailsValues } from '@/api/get-tmdb-movie-details';
import type { IMovie, ITmdbMovie } from '@/api/types';
import { DateField } from '@/components/form/date-field';
import { GenrePicker } from '@/components/form/genre-picker';
import { RatingField } from '@/components/form/rating-field';
import { TextAreaField } from '@/components/form/text-area-field';
import { TextField } from '@/components/form/text-field';
import { TmdbSearch } from '@/components/tmdb-search';
import { useCreateMovieMutation } from '@/features/movies/api/post-movie';
import { useUpdateMovieMutation } from '@/features/movies/api/put-movie';
import { uploadMoviePoster } from '@/features/movies/api/put-movie-poster';
import { applyApiErrors } from '@/lib/forms/apply-api-errors';
import { notifySaveError } from '@/lib/forms/notify-save-error';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { MOVIE_DETAIL_FIELDS } from '@/lib/validation/movie-details';
import { color } from '@/theme/palette';
import {
  MOVIE_FORM_FIELDS,
  MOVIE_FORM_MESSAGES,
  MOVIE_FORM_SCHEMA,
  movieFormDefaultValues,
  movieTemplateValues,
  toUpdateMovieBody,
  type IMovieFormInput,
  type IMovieFormOutput,
} from '../../constants/constants';
import {
  closeMovieForm,
  MovieFormHeader,
} from '../movie-form-header/movie-form-header';
import { MovieSummaryCard } from '@/components/movie-summary-card';
import { PosterPicker } from '@/components/poster-picker';
import { useTranslation } from 'react-i18next';

interface IMovieEditorProps {
  movie?: IMovie;
  template?: IMovie;
}

export function MovieEditor({ movie, template }: IMovieEditorProps) {
  const { t } = useTranslation();
  const scheme = useAppTheme();
  const isEditing = movie !== undefined;
  const createMovie = useCreateMovieMutation();
  const updateMovie = useUpdateMovieMutation(movie?.id ?? '');
  const invalidateMyMovies = useInvalidateMyMovies();
  const fetchTmdbDetails = useFetchTmdbDetailsValues();
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    setValue,
    clearErrors,
    formState: { isSubmitting },
  } = useForm<IMovieFormInput, unknown, IMovieFormOutput>({
    resolver: zodResolver(MOVIE_FORM_SCHEMA),
    defaultValues: template
      ? movieTemplateValues(template)
      : movieFormDefaultValues(movie),
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
    setValue('tmdbId', movie.tmdbId, options);
    setValue('posterUrl', movie.posterUrl, options);
    setValue('director', '', options);
    setValue('durationMinutes', '', options);
    clearErrors(MOVIE_DETAIL_FIELDS);
    setIsEditingDetails(false);
    void fillTmdbDetails(movie.tmdbId);
  }

  async function fillTmdbDetails(tmdbId: number) {
    const details = await fetchTmdbDetails(tmdbId);
    if (!details || getValues('tmdbId') !== tmdbId) {
      return;
    }
    setValue('director', details.director, { shouldDirty: true });
    setValue('durationMinutes', details.durationMinutes, { shouldDirty: true });
  }

  function removePoster() {
    setValue('poster', undefined);
    setValue('posterUrl', undefined);
  }

  async function sendPoster(
    movieId: string,
    photo: IMovieFormOutput['poster'],
  ) {
    if (!photo) {
      return true;
    }
    try {
      await uploadMoviePoster(movieId, photo);
      await invalidateMyMovies();
      return true;
    } catch {
      toast.error(
        t(
          isEditing
            ? MOVIE_FORM_MESSAGES.posterNotSaved
            : MOVIE_FORM_MESSAGES.posterNotSent,
        ),
      );
      return false;
    }
  }

  const onSubmit = async (values: IMovieFormOutput) => {
    try {
      const { poster: photo, ...body } = values;
      const saved = isEditing
        ? await updateMovie.mutateAsync(toUpdateMovieBody(values))
        : await createMovie.mutateAsync(
            photo ? { ...body, posterUrl: undefined } : body,
          );
      if (await sendPoster(saved.id, photo)) {
        toast.success(
          t(
            isEditing
              ? MOVIE_FORM_MESSAGES.updated
              : MOVIE_FORM_MESSAGES.created,
          ),
        );
      }
      closeMovieForm();
    } catch (error) {
      if (applyApiErrors(error, setError, MOVIE_FORM_FIELDS)) {
        setIsEditingDetails(true);
        return;
      }
      notifySaveError(
        error,
        isEditing
          ? MOVIE_FORM_MESSAGES.saveFailed
          : MOVIE_FORM_MESSAGES.unexpected,
      );
    }
  };

  const save = handleSubmit(onSubmit, (errors) => {
    if (MOVIE_DETAIL_FIELDS.some((field) => field in errors)) {
      setIsEditingDetails(true);
    }
  });

  return (
    <View className="flex-1">
      <MovieFormHeader
        title={
          isEditing ? t('movies.form.editTitle') : t('movies.form.logTitle')
        }
        isSaving={isSubmitting}
        onSave={() => void save()}
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
                isEditing && posterUrl === movie.posterUrl
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

        <RatingField control={control} name="rating" />

        <View className="flex-row gap-2.5">
          <View className="flex-1">
            <DateField
              control={control}
              name="watchedAt"
              label={t('movies.form.watchedOn')}
              maximumDate={new Date()}
            />
          </View>
          <View className="w-[110px]">
            <TextField
              control={control}
              name="watchCount"
              label={t('movies.form.times')}
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="isFavorite"
          render={({ field: { value, onChange } }) => (
            <View className="h-[52px] flex-row items-center justify-between rounded-xl border border-primary-border-color bg-secondary-bg-color px-3.5">
              <Text className="font-medium text-[15px] text-primary-text-color">
                {t('movies.form.favorite')}
              </Text>
              <Switch
                accessibilityLabel={t('movies.form.favorite')}
                value={value}
                onValueChange={onChange}
                trackColor={{ true: color(scheme, 'accent-bg-color') }}
              />
            </View>
          )}
        />

        <TextAreaField
          control={control}
          name="review"
          label={t('movies.form.review')}
          placeholder={t('movies.form.reviewPlaceholder')}
        />
      </ScrollView>
    </View>
  );
}

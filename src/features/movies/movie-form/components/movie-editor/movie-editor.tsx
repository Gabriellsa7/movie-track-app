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

export function MovieEditor({ movie }: { movie?: IMovie }) {
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
    defaultValues: movieFormDefaultValues(movie),
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
        isEditing
          ? MOVIE_FORM_MESSAGES.posterNotSaved
          : MOVIE_FORM_MESSAGES.posterNotSent,
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
          isEditing ? MOVIE_FORM_MESSAGES.updated : MOVIE_FORM_MESSAGES.created,
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
        title={isEditing ? 'Edit movie' : 'Log a movie'}
        isSaving={isSubmitting}
        onSave={() => void save()}
      />
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
                isEditing && posterUrl === movie.posterUrl
                  ? 'Current poster'
                  : undefined
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

        <RatingField control={control} name="rating" />

        <View className="flex-row gap-2.5">
          <View className="flex-1">
            <DateField
              control={control}
              name="watchedAt"
              label="Watched on"
              maximumDate={new Date()}
            />
          </View>
          <View className="w-[110px]">
            <TextField
              control={control}
              name="watchCount"
              label="Times"
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
                Favorite
              </Text>
              <Switch
                accessibilityLabel="Favorite"
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
          label="Your review"
          placeholder="What did you think?"
        />
      </ScrollView>
    </View>
  );
}

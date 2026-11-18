import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, Switch, Text, View } from 'react-native';
import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { useInvalidateMyMovies } from '@/api/get-movies';
import type { ITmdbMovie } from '@/api/types';
import { DateField } from '@/components/form/date-field';
import { TextAreaField } from '@/components/form/text-area-field';
import { TextField } from '@/components/form/text-field';
import { useCreateMovieMutation } from '@/features/movies/api/post-movie';
import { uploadMoviePoster } from '@/features/movies/api/put-movie-poster';
import { applyApiErrors } from '@/lib/forms/apply-api-errors';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';
import {
  MOVIE_FORM_FIELDS,
  MOVIE_FORM_MESSAGES,
  MOVIE_FORM_SCHEMA,
  movieFormDefaultValues,
  type IMovieFormInput,
  type IMovieFormOutput,
} from '../../constants/constants';
import { GenrePicker } from '../genre-picker/genre-picker';
import { PosterPicker } from '../poster-picker/poster-picker';
import { RatingPicker } from '../rating-picker/rating-picker';
import { TmdbSearch } from '../tmdb-search/tmdb-search';

function closeForm() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(ROUTES.movies);
  }
}

export function NewMovieForm() {
  const scheme = useAppTheme();
  const createMovie = useCreateMovieMutation();
  const invalidateMyMovies = useInvalidateMyMovies();
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { isSubmitting },
  } = useForm<IMovieFormInput, unknown, IMovieFormOutput>({
    resolver: zodResolver(MOVIE_FORM_SCHEMA),
    defaultValues: movieFormDefaultValues(),
  });
  const [title, poster, posterUrl] = useWatch({
    control,
    name: ['title', 'poster', 'posterUrl'],
  });

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
    clearErrors(['title', 'releaseYear', 'synopsis', 'genreIds']);
  }

  function removePoster() {
    setValue('poster', undefined);
    setValue('posterUrl', undefined);
  }

  const onSubmit = async ({ poster: photo, ...values }: IMovieFormOutput) => {
    try {
      const movie = await createMovie.mutateAsync(
        photo ? { ...values, posterUrl: undefined } : values,
      );
      if (photo) {
        try {
          await uploadMoviePoster(movie.id, photo);
          await invalidateMyMovies();
        } catch {
          toast.error(MOVIE_FORM_MESSAGES.posterNotSent);
          closeForm();
          return;
        }
      }
      toast.success(MOVIE_FORM_MESSAGES.created);
      closeForm();
    } catch (error) {
      if (applyApiErrors(error, setError, MOVIE_FORM_FIELDS)) {
        return;
      }
      const apiError = ApiError.from(error);
      if (apiError.is(EApiErrorCode.SERVICE_UNAVAILABLE)) {
        return;
      }
      toast.error(
        apiError.is(EApiErrorCode.NETWORK_ERROR)
          ? MOVIE_FORM_MESSAGES.noConnection
          : MOVIE_FORM_MESSAGES.unexpected,
      );
    }
  };

  return (
    <View className="gap-5">
      <TmdbSearch onSelect={fillFromTmdb} />
      <PosterPicker
        title={title}
        photo={poster}
        posterUrl={posterUrl}
        onPick={(photo) => {
          setValue('poster', photo);
        }}
        onRemove={removePoster}
      />
      <TextField control={control} name="title" label="Título" />
      <TextField
        control={control}
        name="releaseYear"
        label="Ano de lançamento"
        keyboardType="number-pad"
        maxLength={4}
      />
      <GenrePicker control={control} name="genreIds" label="Gêneros" />
      <TextAreaField control={control} name="synopsis" label="Sinopse" />
      <RatingPicker control={control} name="rating" label="Sua nota" />
      <DateField
        control={control}
        name="watchedAt"
        label="Assistido em"
        maximumDate={new Date()}
      />
      <TextField
        control={control}
        name="director"
        label="Direção"
        hint="Opcional"
      />
      <TextField
        control={control}
        name="durationMinutes"
        label="Duração (minutos)"
        hint="Opcional"
        keyboardType="number-pad"
        maxLength={4}
      />
      <TextAreaField
        control={control}
        name="review"
        label="Sua resenha"
        hint="Opcional"
      />
      <Controller
        control={control}
        name="isFavorite"
        render={({ field: { value, onChange } }) => (
          <View className="flex-row items-center justify-between">
            <Text className="font-semibold text-sm text-primary-text-color">
              Favorito
            </Text>
            <Switch
              accessibilityLabel="Favorito"
              value={value}
              onValueChange={onChange}
              trackColor={{ true: color(scheme, 'accent-bg-color') }}
            />
          </View>
        )}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isSubmitting }}
        disabled={isSubmitting}
        onPress={() => void handleSubmit(onSubmit)()}
        className="mt-2 h-[52px] items-center justify-center rounded-xl bg-accent-bg-color active:bg-accent-hover-bg-color disabled:opacity-60"
      >
        <Text className="font-semibold text-base text-on-accent-text-color">
          {isSubmitting ? 'Salvando…' : 'Registrar filme'}
        </Text>
      </Pressable>
    </View>
  );
}

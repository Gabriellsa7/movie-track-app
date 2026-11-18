import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Switch, Text, View } from 'react-native';
import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import { DateField } from '@/components/form/date-field';
import { TextAreaField } from '@/components/form/text-area-field';
import { TextField } from '@/components/form/text-field';
import { useCreateMovieMutation } from '@/features/movies/api/post-movie';
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
import { RatingPicker } from '../rating-picker/rating-picker';

export function NewMovieForm() {
  const scheme = useAppTheme();
  const createMovie = useCreateMovieMutation();
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<IMovieFormInput, unknown, IMovieFormOutput>({
    resolver: zodResolver(MOVIE_FORM_SCHEMA),
    defaultValues: movieFormDefaultValues(),
  });

  const onSubmit = async (values: IMovieFormOutput) => {
    try {
      await createMovie.mutateAsync(values);
      toast.success(MOVIE_FORM_MESSAGES.created);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace(ROUTES.movies);
      }
    } catch (error) {
      if (applyApiErrors(error, setError, MOVIE_FORM_FIELDS)) {
        return;
      }
      const apiError = ApiError.from(error);
      // 503s already get a global toast (see query-client.ts).
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

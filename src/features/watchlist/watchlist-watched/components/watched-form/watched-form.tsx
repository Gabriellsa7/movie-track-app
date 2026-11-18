import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { toast } from 'sonner-native';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';
import type { IWatchlistItem } from '@/api/types';
import { DateField } from '@/components/form/date-field';
import { RatingField } from '@/components/form/rating-field';
import { TextAreaField } from '@/components/form/text-area-field';
import { applyApiErrors } from '@/lib/forms/apply-api-errors';
import { useAppTheme } from '@/lib/theme/use-app-theme';
import { ROUTES } from '@/routes/routes.constants';
import { color } from '@/theme/palette';
import { useMarkWatchedMutation } from '../../../api/post-watchlist-item-watched';
import {
  missingFields,
  WATCHED_FIELDS,
  watchedDefaultValues,
  watchedSchemaFor,
  type IWatchedInput,
  type IWatchedOutput,
  type TMissingField,
} from '../../constants/constants';
import { MissingDetails } from '../missing-details/missing-details';
import { WatchedHeader } from '../watched-header/watched-header';

const ALL_DETAILS: TMissingField[] = ['releaseYear', 'genreIds', 'synopsis'];

export function closeWatched() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(ROUTES.watchlist);
  }
}

export function WatchedForm({ item }: { item: IWatchlistItem }) {
  const scheme = useAppTheme();
  const markWatched = useMarkWatchedMutation(item.id);
  const [missing, setMissing] = useState(() => missingFields(item));
  const missingRef = useRef(missing);
  const resolver: Resolver<IWatchedInput, unknown, IWatchedOutput> = (
    values,
    context,
    options,
  ) =>
    zodResolver(watchedSchemaFor(missingRef.current))(values, context, options);
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<IWatchedInput, unknown, IWatchedOutput>({
    resolver,
    defaultValues: watchedDefaultValues(),
  });

  const onSubmit = async ({
    releaseYear,
    genreIds,
    synopsis,
    ...values
  }: IWatchedOutput) => {
    try {
      await markWatched.mutateAsync({
        ...values,
        ...(missing.includes('releaseYear') && { releaseYear }),
        ...(missing.includes('genreIds') && { genreIds }),
        ...(missing.includes('synopsis') && { synopsis }),
      });
      toast.success('Movie logged and removed from your watchlist');
      closeWatched();
    } catch (error) {
      const apiError = ApiError.from(error);
      if (apiError.is(EApiErrorCode.INCOMPLETE_MOVIE)) {
        missingRef.current = ALL_DETAILS;
        setMissing(ALL_DETAILS);
        return;
      }
      if (applyApiErrors(error, setError, WATCHED_FIELDS)) {
        return;
      }
      if (apiError.is(EApiErrorCode.SERVICE_UNAVAILABLE)) {
        return;
      }
      toast.error(
        apiError.is(EApiErrorCode.NETWORK_ERROR)
          ? "Can't reach the server. Check your connection and try again."
          : "Couldn't log the movie. Try again.",
      );
    }
  };

  return (
    <ScrollView
      contentContainerClassName="grow gap-4 px-5 pb-8 pt-3"
      keyboardShouldPersistTaps="handled"
    >
      <View className="h-1 w-10 self-center rounded-sm bg-secondary-border-color" />
      <WatchedHeader
        title={item.title}
        posterUrl={item.posterUrl}
        onClose={closeWatched}
      />
      <RatingField control={control} name="rating" />
      {missing.length > 0 && (
        <MissingDetails control={control} missing={missing} />
      )}
      <View className="flex-row items-end gap-2.5">
        <View className="flex-1">
          <DateField
            control={control}
            name="watchedAt"
            label="Watched on"
            maximumDate={new Date()}
          />
        </View>
        <Controller
          control={control}
          name="isFavorite"
          render={({ field: { value, onChange } }) => (
            <View className="min-h-[52px] flex-row items-center gap-2 rounded-xl border border-primary-border-color px-3">
              <Switch
                accessibilityLabel="Favorite"
                value={value}
                onValueChange={onChange}
                trackColor={{ true: color(scheme, 'accent-bg-color') }}
              />
              <Text className="font-medium text-sm text-primary-text-color">
                Favorite
              </Text>
            </View>
          )}
        />
      </View>
      <TextAreaField
        control={control}
        name="review"
        label="Your review"
        placeholder="What did you think?"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isSubmitting }}
        disabled={isSubmitting}
        onPress={() => void handleSubmit(onSubmit)()}
        className="mt-auto h-[52px] items-center justify-center rounded-xl bg-accent-bg-color active:bg-accent-hover-bg-color disabled:opacity-60"
      >
        <Text className="font-semibold text-base text-on-accent-text-color">
          {isSubmitting ? 'Saving…' : 'Log and remove from list'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

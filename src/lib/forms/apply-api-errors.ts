import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from '@/api/api-error';
import { EApiErrorCode } from '@/api/error-codes';

const FIELD_ERRORS: Partial<
  Record<EApiErrorCode, { field: string; message: string }>
> = {
  [EApiErrorCode.EMAIL_TAKEN]: {
    field: 'email',
    message: 'errors.emailHasAccount',
  },
  [EApiErrorCode.INVALID_CREDENTIALS]: {
    field: 'currentPassword',
    message: 'errors.wrongPassword',
  },
  [EApiErrorCode.CURRENT_PASSWORD_REQUIRED]: {
    field: 'currentPassword',
    message: 'errors.confirmPasswordToChangeEmail',
  },
  [EApiErrorCode.MOVIE_ALREADY_LOGGED]: {
    field: 'title',
    message: 'errors.movieAlreadyLogged',
  },
  [EApiErrorCode.INVALID_RATING]: {
    field: 'rating',
    message: 'errors.invalidRating',
  },
  [EApiErrorCode.INVALID_RELEASE_YEAR]: {
    field: 'releaseYear',
    message: 'errors.invalidYear',
  },
  [EApiErrorCode.INVALID_WATCHED_AT]: {
    field: 'watchedAt',
    message: 'errors.dateInFuture',
  },
  [EApiErrorCode.INVALID_GENRE]: {
    field: 'genreIds',
    message: 'errors.invalidGenre',
  },
};

export function applyApiErrors<TFields extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFields>,
  fields: readonly Path<TFields>[],
): boolean {
  const apiError = ApiError.from(error);
  const isFormField = (field: string): field is Path<TFields> =>
    (fields as readonly string[]).includes(field);

  if (apiError.is(EApiErrorCode.VALIDATION_ERROR)) {
    const known = apiError.fieldErrors
      .map(({ field, message }) => ({
        field: field.split(/[./]/)[0] ?? field,
        message,
      }))
      .filter(({ field }) => isFormField(field));
    known.forEach(({ field, message }) => {
      setError(field as Path<TFields>, { type: 'server', message });
    });
    return known.length > 0;
  }

  const mapped = FIELD_ERRORS[apiError.code as EApiErrorCode];
  if (mapped && isFormField(mapped.field)) {
    setError(mapped.field, { type: 'server', message: mapped.message });
    return true;
  }
  return false;
}

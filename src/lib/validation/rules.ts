import { z } from 'zod';

export const FIRST_FILM_YEAR = 1888;
export const RATING_STEP = 0.5;
export const MAX_GENRES = 5;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 80;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Enter a valid e-mail'));

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters`)
  .max(PASSWORD_MAX_LENGTH, `Use at most ${PASSWORD_MAX_LENGTH} characters`)
  .regex(/[A-Za-z]/, 'Use at least one letter')
  .regex(/\d/, 'Use at least one number');

export const PASSWORD_RULES = [
  {
    label: `Between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`,
    test: (password: string) =>
      password.length >= PASSWORD_MIN_LENGTH &&
      password.length <= PASSWORD_MAX_LENGTH,
  },
  {
    label: 'At least one letter',
    test: (password: string) => /[A-Za-z]/.test(password),
  },
  {
    label: 'At least one number',
    test: (password: string) => /\d/.test(password),
  },
] as const;

export const nameSchema = z
  .string()
  .trim()
  .min(NAME_MIN_LENGTH, `Use at least ${NAME_MIN_LENGTH} characters`)
  .max(NAME_MAX_LENGTH, `Use at most ${NAME_MAX_LENGTH} characters`);

export const ratingSchema = z
  .number('Give it a rating')
  .min(1, 'The rating goes from 1 to 10')
  .max(10, 'The rating goes from 1 to 10')
  .multipleOf(RATING_STEP, 'Use half points: 7, 7.5, 8…');

export const releaseYearSchema = z
  .number('Enter the year')
  .int('Enter a valid year')
  .min(FIRST_FILM_YEAR, `The first movie is from ${FIRST_FILM_YEAR}`)
  .refine(
    (year) => year <= new Date().getFullYear() + 1,
    'Year too far in the future',
  );

export const genreIdsSchema = z
  .array(z.string())
  .min(1, 'Pick at least one genre')
  .max(MAX_GENRES, `Pick up to ${MAX_GENRES} genres`);

export const isoDateSchema = z
  .string()
  .regex(ISO_DATE_PATTERN, 'Enter a valid date');

export const watchedAtSchema = isoDateSchema.refine(
  (date) => date <= toIsoDate(new Date()),
  "The date can't be in the future",
);

export const imageAssetSchema = z
  .object({
    uri: z.string(),
    mimeType: z.string().optional(),
    fileSize: z.number().optional(),
  })
  .refine(
    (asset) =>
      asset.mimeType === undefined ||
      (IMAGE_MIME_TYPES as readonly string[]).includes(asset.mimeType),
    'Use a JPEG, PNG or WebP image',
  )
  .refine(
    (asset) =>
      asset.fileSize === undefined || asset.fileSize <= MAX_IMAGE_BYTES,
    'The image can be up to 5 MB',
  );

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

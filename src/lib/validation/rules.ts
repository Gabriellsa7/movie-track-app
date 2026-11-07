import { z } from 'zod';

// Mirrors the backend rules, so most mistakes are caught before a request.
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

// Trim before checking the format, so pasted addresses with spaces still pass.
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Informe um e-mail válido'));

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use pelo menos ${PASSWORD_MIN_LENGTH} caracteres`)
  .max(PASSWORD_MAX_LENGTH, `Use no máximo ${PASSWORD_MAX_LENGTH} caracteres`)
  .regex(/[A-Za-z]/, 'Use pelo menos uma letra')
  .regex(/\d/, 'Use pelo menos um número');

// The same rules as passwordSchema, shown as a live checklist while typing.
export const PASSWORD_RULES = [
  {
    label: `Entre ${PASSWORD_MIN_LENGTH} e ${PASSWORD_MAX_LENGTH} caracteres`,
    test: (password: string) =>
      password.length >= PASSWORD_MIN_LENGTH &&
      password.length <= PASSWORD_MAX_LENGTH,
  },
  {
    label: 'Pelo menos uma letra',
    test: (password: string) => /[A-Za-z]/.test(password),
  },
  {
    label: 'Pelo menos um número',
    test: (password: string) => /\d/.test(password),
  },
] as const;

export const nameSchema = z
  .string()
  .trim()
  .min(NAME_MIN_LENGTH, `Use pelo menos ${NAME_MIN_LENGTH} caracteres`)
  .max(NAME_MAX_LENGTH, `Use no máximo ${NAME_MAX_LENGTH} caracteres`);

export const ratingSchema = z
  .number('Dê uma nota')
  .min(1, 'A nota vai de 1 a 10')
  .max(10, 'A nota vai de 1 a 10')
  .multipleOf(RATING_STEP, 'Use meio ponto: 7, 7.5, 8…');

export const releaseYearSchema = z
  .number('Informe o ano')
  .int('Informe um ano válido')
  .min(FIRST_FILM_YEAR, `O primeiro filme é de ${FIRST_FILM_YEAR}`)
  .refine(
    (year) => year <= new Date().getFullYear() + 1,
    'Ano muito no futuro',
  );

export const genreIdsSchema = z
  .array(z.string())
  .min(1, 'Escolha pelo menos um gênero')
  .max(MAX_GENRES, `Escolha até ${MAX_GENRES} gêneros`);

// Dates go to the API as YYYY-MM-DD, compared in local time.
export const isoDateSchema = z
  .string()
  .regex(ISO_DATE_PATTERN, 'Informe uma data válida');

export const watchedAtSchema = isoDateSchema.refine(
  (date) => date <= toIsoDate(new Date()),
  'A data não pode estar no futuro',
);

// The image picker's asset; mimeType and fileSize can be missing on some devices.
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
    'Use uma imagem JPEG, PNG ou WebP',
  )
  .refine(
    (asset) =>
      asset.fileSize === undefined || asset.fileSize <= MAX_IMAGE_BYTES,
    'A imagem pode ter até 5 MB',
  );

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

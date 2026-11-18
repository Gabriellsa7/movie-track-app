import { translateMessage } from '@/i18n/message';
import {
  emailSchema,
  genreIdsSchema,
  imageAssetSchema,
  passwordSchema,
  ratingSchema,
  releaseYearSchema,
  toIsoDate,
  watchedAtSchema,
} from './rules';

const firstIssue = (result: {
  success: boolean;
  error?: { issues: { message: string }[] };
}) => {
  const message = result.error?.issues[0]?.message;
  return message === undefined ? undefined : translateMessage(message);
};

describe('When we validate form values like the API does', () => {
  it('should accept ratings from 1 to 10 in half steps', () => {
    expect(ratingSchema.safeParse(7.5).success).toBe(true);
    expect(firstIssue(ratingSchema.safeParse(7.3))).toBe(
      'Use half points: 7, 7.5, 8…',
    );
    expect(firstIssue(ratingSchema.safeParse(10.5))).toBe(
      'The rating goes from 1 to 10',
    );
  });

  it('should accept release years from 1888 to next year', () => {
    const nextYear = new Date().getFullYear() + 1;

    expect(releaseYearSchema.safeParse(nextYear).success).toBe(true);
    expect(firstIssue(releaseYearSchema.safeParse(1887))).toBe(
      'The first movie is from 1888',
    );
    expect(firstIssue(releaseYearSchema.safeParse(nextYear + 1))).toBe(
      'Year too far in the future',
    );
  });

  it('should refuse a watch date in the future', () => {
    expect(watchedAtSchema.safeParse(toIsoDate(new Date())).success).toBe(true);
    expect(firstIssue(watchedAtSchema.safeParse('2999-01-01'))).toBe(
      "The date can't be in the future",
    );
    expect(firstIssue(watchedAtSchema.safeParse('01/02/2026'))).toBe(
      'Enter a valid date',
    );
  });

  it('should accept from 1 to 5 genres', () => {
    expect(genreIdsSchema.safeParse(['a']).success).toBe(true);
    expect(genreIdsSchema.safeParse([]).success).toBe(false);
    expect(
      genreIdsSchema.safeParse(['a', 'b', 'c', 'd', 'e', 'f']).success,
    ).toBe(false);
  });

  it('should ask for a password with a letter and a number', () => {
    expect(passwordSchema.safeParse('filmes2026').success).toBe(true);
    expect(firstIssue(passwordSchema.safeParse('abcdefgh'))).toBe(
      'Use at least one number',
    );
    expect(firstIssue(passwordSchema.safeParse('a1'))).toBe(
      'Use at least 8 characters',
    );
  });

  it('should normalize the e-mail before checking it', () => {
    expect(emailSchema.parse(' Gabriel@Email.com ')).toBe('gabriel@email.com');
    expect(emailSchema.safeParse('gabriel@').success).toBe(false);
  });

  it('should accept JPEG, PNG or WebP picker images up to 5 MB', () => {
    const png = { uri: 'file:///a.png', mimeType: 'image/png', fileSize: 1000 };

    expect(imageAssetSchema.safeParse(png).success).toBe(true);
    expect(imageAssetSchema.safeParse({ uri: 'file:///a' }).success).toBe(true);
    expect(
      firstIssue(imageAssetSchema.safeParse({ ...png, mimeType: 'image/gif' })),
    ).toBe('Use a JPEG, PNG or WebP image');
    expect(
      firstIssue(
        imageAssetSchema.safeParse({ ...png, fileSize: 5 * 1024 * 1024 + 1 }),
      ),
    ).toBe('The image can be up to 5 MB');
  });
});

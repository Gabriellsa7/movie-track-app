import type { TLanguage } from '@/i18n';
import { formatDecimal } from '@/i18n/format';

export function formatRating(rating: number, language: TLanguage): string {
  return Number.isInteger(rating)
    ? String(rating)
    : formatDecimal(rating, 1, language);
}

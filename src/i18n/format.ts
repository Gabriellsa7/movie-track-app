import type { TLanguage } from './index';

export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions,
  language: TLanguage,
): string {
  return date.toLocaleDateString(language, { timeZone: 'UTC', ...options });
}

export function formatShortMonth(date: Date, language: TLanguage): string {
  const month = date.toLocaleDateString(language, {
    month: 'short',
    timeZone: 'UTC',
  });
  const withoutDot = month.replace(/\.$/, '');
  return withoutDot.charAt(0).toUpperCase() + withoutDot.slice(1);
}

export function formatDecimal(
  value: number,
  fractionDigits: number,
  language: TLanguage,
): string {
  return value.toLocaleString(language, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

import type { TLanguage } from '@/i18n';
import { formatDate } from '@/i18n/format';

export function formatWatchedDate(
  isoDate: string,
  language: TLanguage,
): string {
  return formatDate(
    new Date(isoDate),
    { day: 'numeric', month: 'short', year: 'numeric' },
    language,
  );
}

export function formatRuntime(durationMinutes: number): string {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  if (hours === 0) {
    return `${String(minutes)}m`;
  }
  return minutes === 0
    ? `${String(hours)}h`
    : `${String(hours)}h ${String(minutes)}m`;
}

import { SHORT_MONTHS } from '@/lib/stats';

export function formatWatchedDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${SHORT_MONTHS[date.getUTCMonth()] ?? ''} ${String(date.getUTCDate())}, ${String(date.getUTCFullYear())}`;
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

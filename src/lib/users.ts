import { SHORT_MONTHS } from '@/lib/stats';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const AVATAR_TONES = [
  { bg: 'bg-accent-soft-bg-color', text: 'text-accent-text-color' },
  { bg: 'bg-success-soft-bg-color', text: 'text-success-text-color' },
  { bg: 'bg-tertiary-bg-color', text: 'text-secondary-text-color' },
] as const;

export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.charAt(0) ?? '';
  const last = words.length > 1 ? (words.at(-1)?.charAt(0) ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

export function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export function avatarToneOf(id: string): (typeof AVATAR_TONES)[number] {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash += id.charCodeAt(index);
  }
  return AVATAR_TONES[hash % AVATAR_TONES.length] ?? AVATAR_TONES[0];
}

export function formatSince(isoDate: string): string {
  const date = new Date(isoDate);
  return `${SHORT_MONTHS[date.getUTCMonth()] ?? ''} ${String(date.getUTCFullYear())}`;
}

export function formatMemberSince(isoDate: string): string {
  const date = new Date(isoDate);
  return `Member since ${MONTHS[date.getUTCMonth()] ?? ''} ${String(date.getUTCFullYear())}`;
}

export function formatMoviesCount(count: number): string {
  return count === 1 ? '1 movie' : `${String(count)} movies`;
}

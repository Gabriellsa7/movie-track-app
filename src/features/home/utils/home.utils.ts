import { tFor, type TLanguage } from '@/i18n';
export function greetingFor(
  date: Date,
  name: string | undefined,
  language: TLanguage,
): string {
  const hour = date.getHours();
  const greeting = tFor(language)(
    hour >= 5 && hour < 12
      ? 'home.greeting.morning'
      : hour >= 12 && hour < 18
        ? 'home.greeting.afternoon'
        : 'home.greeting.evening',
  );
  const firstName = name?.trim().split(/\s+/)[0];
  return firstName ? `${greeting}, ${firstName}` : greeting;
}

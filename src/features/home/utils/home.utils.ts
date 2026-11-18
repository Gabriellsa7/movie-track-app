export function greetingFor(date: Date, name?: string): string {
  const hour = date.getHours();
  const greeting =
    hour >= 5 && hour < 12
      ? 'Good morning'
      : hour >= 12 && hour < 18
        ? 'Good afternoon'
        : 'Good evening';
  const firstName = name?.trim().split(/\s+/)[0];
  return firstName ? `${greeting}, ${firstName}` : greeting;
}

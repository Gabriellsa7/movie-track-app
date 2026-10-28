const COLOR_TOKENS = [
  'background',
  'sidebar',
  'surface',
  'surface-2',
  'border',
  'border-strong',
  'text',
  'text-soft',
  'text-muted',
  'accent',
  'accent-text',
  'on-accent',
  'accent-soft',
  'accent-border',
  'danger',
  'danger-soft',
  'success',
  'success-soft',
  'star-empty',
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      // Same token names as the web app's CSS variables (bg-surface, text-muted…).
      colors: Object.fromEntries(
        COLOR_TOKENS.map((token) => [
          token,
          `rgb(var(--color-${token}) / <alpha-value>)`,
        ]),
      ),
      fontFamily: {
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
        display: ['BebasNeue_400Regular'],
      },
    },
  },
  plugins: [],
};

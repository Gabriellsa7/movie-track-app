// Same names as src/theme/palette.ts and the web app's CSS variables.
const COLOR_TOKENS = [
  'primary-bg-color',
  'secondary-bg-color',
  'tertiary-bg-color',
  'sidebar-bg-color',
  'accent-bg-color',
  'accent-hover-bg-color',
  'accent-soft-bg-color',
  'danger-soft-bg-color',
  'success-soft-bg-color',
  'overlay-bg-color',
  'primary-text-color',
  'secondary-text-color',
  'tertiary-text-color',
  'accent-text-color',
  'on-accent-text-color',
  'danger-text-color',
  'success-text-color',
  'primary-border-color',
  'secondary-border-color',
  'accent-border-color',
  'danger-border-color',
  'success-border-color',
  'star-filled-color',
  'star-empty-color',
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      // bg-primary-bg-color, text-primary-text-color, border-primary-border-color…
      colors: Object.fromEntries(
        COLOR_TOKENS.map((token) => [
          token,
          `rgb(var(--${token}) / <alpha-value>)`,
        ]),
      ),
      // size: text-title, text-body… Pair with the font in the comment (font-display, font-semibold…).
      fontSize: {
        display: ['72px', { lineHeight: '68px', letterSpacing: '1px' }], // font-display
        title: ['56px', { lineHeight: '56px', letterSpacing: '1px' }], // font-display
        'title-sm': ['40px', { lineHeight: '40px', letterSpacing: '1px' }], // font-display
        stat: ['28px', { lineHeight: '28px', letterSpacing: '1px' }], // font-display
        subtitle: ['20px', { lineHeight: '26px' }], // font-semibold
        heading: ['16px', { lineHeight: '22px' }], // font-semibold
        body: ['15px', { lineHeight: '24px' }], // font-sans
        button: ['14px', { lineHeight: '20px' }], // font-semibold
        label: ['13px', { lineHeight: '18px' }], // font-semibold
        caption: ['13px', { lineHeight: '18px' }], // font-sans
        overline: ['13px', { lineHeight: '18px', letterSpacing: '1px' }], // font-semibold uppercase
        small: ['12px', { lineHeight: '17px' }], // font-semibold
      },
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

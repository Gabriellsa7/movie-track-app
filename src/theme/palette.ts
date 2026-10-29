// Colors from the approved mockups (FQ-25), as "R G B" so Tailwind can add opacity.
export const PALETTE = {
  dark: {
    'primary-bg-color': '15 17 21',
    'secondary-bg-color': '26 29 36',
    'tertiary-bg-color': '35 39 49',
    'sidebar-bg-color': '19 22 27',
    'accent-bg-color': '245 184 61',
    'accent-hover-bg-color': '255 210 122',
    'accent-soft-bg-color': '42 36 24',
    'danger-soft-bg-color': '46 28 28',
    'success-soft-bg-color': '22 38 30',
    // Use with opacity: bg-overlay-bg-color/80
    'overlay-bg-color': '7 8 10',

    'primary-text-color': '232 230 227',
    'secondary-text-color': '201 199 195',
    'tertiary-text-color': '138 143 152',
    'accent-text-color': '245 184 61',
    'on-accent-text-color': '15 17 21',
    'danger-text-color': '242 139 130',
    'success-text-color': '91 192 138',

    'primary-border-color': '44 49 60',
    'secondary-border-color': '58 63 75',
    'accent-border-color': '74 59 28',
    'danger-border-color': '242 139 130',
    'success-border-color': '36 80 58',

    'star-filled-color': '245 184 61',
    'star-empty-color': '74 80 92',
  },
  light: {
    'primary-bg-color': '247 245 241',
    'secondary-bg-color': '255 255 255',
    'tertiary-bg-color': '239 236 230',
    'sidebar-bg-color': '239 236 230',
    'accent-bg-color': '245 184 61',
    'accent-hover-bg-color': '224 165 44',
    'accent-soft-bg-color': '251 239 211',
    'danger-soft-bg-color': '251 233 231',
    'success-soft-bg-color': '227 243 234',
    // Use with opacity: bg-overlay-bg-color/45
    'overlay-bg-color': '23 25 30',

    'primary-text-color': '23 25 30',
    'secondary-text-color': '58 61 68',
    'tertiary-text-color': '94 99 107',
    'accent-text-color': '138 90 0',
    'on-accent-text-color': '15 17 21',
    'danger-text-color': '179 38 30',
    'success-text-color': '30 122 76',

    'primary-border-color': '221 216 207',
    'secondary-border-color': '207 201 190',
    'accent-border-color': '235 203 134',
    'danger-border-color': '179 38 30',
    'success-border-color': '168 216 189',

    'star-filled-color': '245 184 61',
    'star-empty-color': '207 201 190',
  },
} as const;

export type TColorScheme = keyof typeof PALETTE;
export type TColorToken = keyof (typeof PALETTE)['dark'];

export function rgb(scheme: TColorScheme, token: TColorToken): string {
  return `rgb(${PALETTE[scheme][token].replaceAll(' ', ', ')})`;
}

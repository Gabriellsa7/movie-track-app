// Colors from the approved mockups (FQ-25), as "R G B" so Tailwind can add opacity.
export const PALETTE = {
  dark: {
    background: '15 17 21',
    sidebar: '19 22 27',
    surface: '26 29 36',
    'surface-2': '35 39 49',
    border: '44 49 60',
    'border-strong': '58 63 75',
    text: '232 230 227',
    'text-soft': '201 199 195',
    'text-muted': '138 143 152',
    accent: '245 184 61',
    'accent-text': '245 184 61',
    'on-accent': '15 17 21',
    'accent-soft': '42 36 24',
    'accent-border': '74 59 28',
    danger: '242 139 130',
    'danger-soft': '46 28 28',
    success: '91 192 138',
    'success-soft': '22 38 30',
    'star-empty': '74 80 92',
  },
  light: {
    background: '247 245 241',
    sidebar: '239 236 230',
    surface: '255 255 255',
    'surface-2': '239 236 230',
    border: '221 216 207',
    'border-strong': '207 201 190',
    text: '23 25 30',
    'text-soft': '58 61 68',
    'text-muted': '94 99 107',
    accent: '245 184 61',
    'accent-text': '138 90 0',
    'on-accent': '15 17 21',
    'accent-soft': '251 239 211',
    'accent-border': '235 203 134',
    danger: '179 38 30',
    'danger-soft': '251 233 231',
    success: '30 122 76',
    'success-soft': '227 243 234',
    'star-empty': '207 201 190',
  },
} as const;

export type TColorScheme = keyof typeof PALETTE;
export type TColorToken = keyof (typeof PALETTE)['dark'];

export function rgb(scheme: TColorScheme, token: TColorToken): string {
  return `rgb(${PALETTE[scheme][token].replaceAll(' ', ', ')})`;
}

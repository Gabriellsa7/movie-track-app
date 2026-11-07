// Colors from the approved mockups (FQ-25).
export const PALETTE = {
  dark: {
    'primary-bg-color': '#0F1115',
    'secondary-bg-color': '#1A1D24',
    'tertiary-bg-color': '#232731',
    'sidebar-bg-color': '#13161B',
    'accent-bg-color': '#F5B83D',
    'accent-hover-bg-color': '#FFD27A',
    'accent-soft-bg-color': '#2A2418',
    'danger-soft-bg-color': '#2E1C1C',
    'success-soft-bg-color': '#16261E',
    // Use with opacity: bg-overlay-bg-color/80
    'overlay-bg-color': '#07080A',

    'primary-text-color': '#E8E6E3',
    'secondary-text-color': '#C9C7C3',
    'tertiary-text-color': '#8A8F98',
    'accent-text-color': '#F5B83D',
    'on-accent-text-color': '#0F1115',
    'danger-text-color': '#F28B82',
    'success-text-color': '#5BC08A',

    'primary-border-color': '#2C313C',
    'secondary-border-color': '#3A3F4B',
    'accent-border-color': '#4A3B1C',
    'danger-border-color': '#F28B82',
    'success-border-color': '#24503A',

    'star-filled-color': '#F5B83D',
    'star-empty-color': '#4A505C',
  },
  light: {
    'primary-bg-color': '#F7F5F1',
    'secondary-bg-color': '#FFFFFF',
    'tertiary-bg-color': '#EFECE6',
    'sidebar-bg-color': '#EFECE6',
    'accent-bg-color': '#F5B83D',
    'accent-hover-bg-color': '#E0A52C',
    'accent-soft-bg-color': '#FBEFD3',
    'danger-soft-bg-color': '#FBE9E7',
    'success-soft-bg-color': '#E3F3EA',
    // Use with opacity: bg-overlay-bg-color/45
    'overlay-bg-color': '#17191E',

    'primary-text-color': '#17191E',
    'secondary-text-color': '#3A3D44',
    'tertiary-text-color': '#5E636B',
    'accent-text-color': '#8A5A00',
    'on-accent-text-color': '#0F1115',
    'danger-text-color': '#B3261E',
    'success-text-color': '#1E7A4C',

    'primary-border-color': '#DDD8CF',
    'secondary-border-color': '#CFC9BE',
    'accent-border-color': '#EBCB86',
    'danger-border-color': '#B3261E',
    'success-border-color': '#A8D8BD',

    'star-filled-color': '#F5B83D',
    'star-empty-color': '#CFC9BE',
  },
} as const;

export type TColorScheme = keyof typeof PALETTE;
export type TColorToken = keyof (typeof PALETTE)['dark'];

export function color(scheme: TColorScheme, token: TColorToken): string {
  return PALETTE[scheme][token];
}

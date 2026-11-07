import { vars } from 'nativewind';
import { PALETTE, type TColorScheme } from './palette';

// Tailwind's opacity modifier (bg-x/80) needs the variables as "R G B".
function hexToRgbChannels(hex: string): string {
  const value = parseInt(hex.slice(1), 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}

function toVars(scheme: TColorScheme) {
  return vars(
    Object.fromEntries(
      Object.entries(PALETTE[scheme]).map(([token, value]) => [
        `--${token}`,
        hexToRgbChannels(value),
      ]),
    ),
  );
}

// Applied on the root view; every bg-*/text-* class reads these variables.
export const THEME_VARS: Record<TColorScheme, ReturnType<typeof vars>> = {
  dark: toVars('dark'),
  light: toVars('light'),
};

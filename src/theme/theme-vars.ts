import { vars } from 'nativewind';
import { PALETTE, type TColorScheme } from './palette';

function toVars(scheme: TColorScheme) {
  return vars(
    Object.fromEntries(
      Object.entries(PALETTE[scheme]).map(([token, value]) => [
        `--color-${token}`,
        value,
      ]),
    ),
  );
}

// Applied on the root view; every bg-*/text-* class reads these variables.
export const THEME_VARS: Record<TColorScheme, ReturnType<typeof vars>> = {
  dark: toVars('dark'),
  light: toVars('light'),
};

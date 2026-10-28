import { Toaster as SonnerToaster } from 'sonner-native';
import type { TColorScheme } from '@/theme/palette';

export function Toaster({ scheme }: { scheme: TColorScheme }) {
  return <SonnerToaster theme={scheme} position="bottom-center" closeButton />;
}

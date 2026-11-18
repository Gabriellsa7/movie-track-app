import 'i18next';
import type { EN_TRANSLATION } from './resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: { translation: typeof EN_TRANSLATION };
  }
}

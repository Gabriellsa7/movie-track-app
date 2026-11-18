import { i18n, tFor, type TLanguage } from './index';

const SEPARATOR = '|';

type TValues = Record<string, string | number>;

export function messageKey(key: string, values?: TValues): string {
  return values ? `${key}${SEPARATOR}${JSON.stringify(values)}` : key;
}

export function translateMessage(
  message: string,
  language?: TLanguage,
): string {
  const separatorIndex = message.indexOf(SEPARATOR);
  const key =
    separatorIndex === -1 ? message : message.slice(0, separatorIndex);
  if (!i18n.exists(key)) {
    return message;
  }
  const values =
    separatorIndex === -1
      ? undefined
      : (JSON.parse(message.slice(separatorIndex + 1)) as TValues);
  const t = language ? tFor(language) : i18n.t.bind(i18n);
  return t(key as never, values as never) as unknown as string;
}

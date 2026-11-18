import { i18n } from './index';

const SEPARATOR = '|';

type TValues = Record<string, string | number>;

export function messageKey(key: string, values?: TValues): string {
  return values ? `${key}${SEPARATOR}${JSON.stringify(values)}` : key;
}

export function translateMessage(message: string): string {
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
  return i18n.t(key, values as never) as unknown as string;
}

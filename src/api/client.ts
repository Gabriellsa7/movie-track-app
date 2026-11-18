import axios from 'axios';
import { env } from '@/config/env';
import { currentLanguage } from '@/i18n';
import { ApiError } from './api-error';
import { EApiErrorCode } from './error-codes';

const REQUEST_TIMEOUT_MILLISECONDS = 15_000;

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
  }
  interface InternalAxiosRequestConfig {
    retriedAfterRefresh?: boolean;
  }
}

export interface ISessionHandlers {
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string>;
  onSessionExpired: () => void;
}

let sessionHandlers: ISessionHandlers | null = null;
let refreshInFlight: Promise<string> | null = null;

export function registerSessionHandlers(handlers: ISessionHandlers | null) {
  sessionHandlers = handlers;
}

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: REQUEST_TIMEOUT_MILLISECONDS,
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  config.headers.set('Accept-Language', currentLanguage());
  const accessToken = sessionHandlers?.getAccessToken();
  if (accessToken && !config.headers.has('Authorization')) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

apiClient.interceptors.response.use(undefined, async (error: unknown) => {
  const apiError = ApiError.from(error);
  const config = axios.isAxiosError(error) ? error.config : undefined;
  const handlers = sessionHandlers;

  const sentWithoutToken =
    apiError.is(EApiErrorCode.INVALID_TOKEN) &&
    config !== undefined &&
    !config.headers.has('Authorization');
  const canRefresh =
    (apiError.is(EApiErrorCode.TOKEN_EXPIRED) || sentWithoutToken) &&
    config !== undefined &&
    !config.skipAuthRefresh &&
    !config.retriedAfterRefresh &&
    handlers !== null;
  if (!canRefresh) {
    throw apiError;
  }

  let accessToken: string;
  try {
    refreshInFlight ??= handlers.refreshAccessToken().finally(() => {
      refreshInFlight = null;
    });
    accessToken = await refreshInFlight;
  } catch (refreshError) {
    const refreshApiError = ApiError.from(refreshError);
    if (refreshApiError.status === 401) {
      handlers.onSessionExpired();
    }
    throw refreshApiError;
  }

  config.retriedAfterRefresh = true;
  config.headers.set('Authorization', `Bearer ${accessToken}`);
  return apiClient.request(config);
});

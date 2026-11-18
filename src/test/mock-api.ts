import type { AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '@/api/client';

export const mockApi = new MockAdapter(apiClient);

export function apiErrorReply(
  status: number,
  code: string,
): [number, { message: string; status: number; code: string }] {
  return [status, { message: code, status, code }];
}

export function authorizationOf(config: AxiosRequestConfig): unknown {
  return config.headers?.Authorization;
}

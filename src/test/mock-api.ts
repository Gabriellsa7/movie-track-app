import type { AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '@/api/client';

// Every test answers the API through this adapter; unmatched requests fail with 404.
export const mockApi = new MockAdapter(apiClient);

export function apiErrorReply(
  status: number,
  code: string,
): [number, { message: string; status: number; code: string }] {
  return [status, { message: code, status, code }];
}

// The bearer token a mocked request carried.
export function authorizationOf(config: AxiosRequestConfig): unknown {
  return config.headers?.Authorization;
}

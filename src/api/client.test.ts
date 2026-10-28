import { apiErrorReply, authorizationOf, mockApi } from '@/test/mock-api';
import {
  apiClient,
  registerSessionHandlers,
  type ISessionHandlers,
} from './client';

function handlersWith(overrides: Partial<ISessionHandlers> = {}) {
  const handlers = {
    getAccessToken: jest.fn(() => 'old-token'),
    refreshAccessToken: jest.fn(() => Promise.resolve('new-token')),
    onSessionExpired: jest.fn(),
    ...overrides,
  };
  registerSessionHandlers(handlers);
  return handlers;
}

// Answers 401 TOKEN_EXPIRED to the old token and 200 to the refreshed one.
function useProtectedRoute() {
  mockApi
    .onGet('/protected')
    .reply((config) =>
      authorizationOf(config) === 'Bearer new-token'
        ? [200, { ok: true }]
        : apiErrorReply(401, 'TOKEN_EXPIRED'),
    );
}

describe('When the client calls the API', () => {
  it('should send the access token as a bearer token', async () => {
    handlersWith();
    let authorization: unknown = null;
    mockApi.onGet('/movies').reply((config) => {
      authorization = authorizationOf(config);
      return [200, {}];
    });

    await apiClient.get('/movies');

    expect(authorization).toBe('Bearer old-token');
  });

  it('should send no token without a session', async () => {
    let authorization: unknown = 'unset';
    mockApi.onGet('/genres').reply((config) => {
      authorization = authorizationOf(config);
      return [200, []];
    });

    await apiClient.get('/genres');

    expect(authorization).toBeUndefined();
  });
});

describe('When the access token expired', () => {
  it('should refresh once for concurrent requests and retry them', async () => {
    const handlers = handlersWith();
    useProtectedRoute();

    const results = await Promise.all([
      apiClient.get<unknown>('/protected'),
      apiClient.get<unknown>('/protected'),
    ]);

    expect(results.map((result) => result.data)).toEqual([
      { ok: true },
      { ok: true },
    ]);
    expect(handlers.refreshAccessToken).toHaveBeenCalledTimes(1);
  });

  it('should end the session when the refresh is refused', async () => {
    const handlers = handlersWith({
      refreshAccessToken: () =>
        apiClient
          .post('/auth/refresh', {}, { skipAuthRefresh: true })
          .then(() => 'never'),
    });
    useProtectedRoute();
    mockApi
      .onPost('/auth/refresh')
      .reply(...apiErrorReply(401, 'TOKEN_REVOKED'));

    await expect(apiClient.get('/protected')).rejects.toMatchObject({
      code: 'TOKEN_REVOKED',
    });
    expect(handlers.onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it('should keep the session when the refresh fails for a network reason', async () => {
    const handlers = handlersWith({
      refreshAccessToken: () => Promise.reject(new Error('offline')),
    });
    useProtectedRoute();

    await expect(apiClient.get('/protected')).rejects.toMatchObject({
      message: 'offline',
    });
    expect(handlers.onSessionExpired).not.toHaveBeenCalled();
  });

  it('should not refresh a request that opted out', async () => {
    const handlers = handlersWith();
    mockApi
      .onPost('/auth/refresh')
      .reply(...apiErrorReply(401, 'TOKEN_EXPIRED'));

    await expect(
      apiClient.post('/auth/refresh', {}, { skipAuthRefresh: true }),
    ).rejects.toMatchObject({ code: 'TOKEN_EXPIRED' });
    expect(handlers.refreshAccessToken).not.toHaveBeenCalled();
  });

  it('should not refresh without session handlers', async () => {
    useProtectedRoute();

    await expect(apiClient.get('/protected')).rejects.toMatchObject({
      code: 'TOKEN_EXPIRED',
    });
  });
});

describe('When the API answers another error', () => {
  it('should reject with the ApiError and not refresh', async () => {
    const handlers = handlersWith();
    mockApi.onGet('/movies/x').reply(...apiErrorReply(404, 'MOVIE_NOT_FOUND'));

    await expect(apiClient.get('/movies/x')).rejects.toMatchObject({
      status: 404,
      code: 'MOVIE_NOT_FOUND',
    });
    expect(handlers.refreshAccessToken).not.toHaveBeenCalled();
  });

  it('should report a dropped connection as NETWORK_ERROR', async () => {
    mockApi.onGet('/movies').networkError();

    await expect(apiClient.get('/movies')).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
    });
  });
});

import { onlineManager } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react-native';
import { apiClient } from '@/api/client';
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ID } from '@/test/constants';
import { A_USER } from '@/test/fixtures';
import { apiErrorReply, authorizationOf, mockApi } from '@/test/mock-api';
import { useSessionStore } from '@/stores/session.store';
import {
  bootstrapSession,
  logout,
  setUpSession,
  startSession,
} from './session';
import {
  readRefreshToken,
  readStoredUser,
  writeRefreshToken,
  writeStoredUser,
} from './session.storage';

const TOKENS = {
  accessToken: ACCESS_TOKEN,
  refreshToken: 'rotated-refresh-token',
};

function answerRefreshAndAccount() {
  mockApi.onPost('/auth/refresh').reply(200, TOKENS);
  mockApi.onGet(`/users/${USER_ID}/account`).reply(200, A_USER);
}

afterEach(() => {
  onlineManager.setOnline(true);
});

describe('When the app starts', () => {
  it('should be anonymous without a stored refresh token', async () => {
    await bootstrapSession();

    expect(useSessionStore.getState().status).toBe('anonymous');
  });

  it('should restore the session and keep the account for offline starts', async () => {
    await writeRefreshToken(REFRESH_TOKEN);
    answerRefreshAndAccount();

    await bootstrapSession();

    expect(useSessionStore.getState()).toMatchObject({
      status: 'authenticated',
      accessToken: ACCESS_TOKEN,
      user: A_USER,
    });
    expect(await readRefreshToken()).toBe('rotated-refresh-token');
    expect(await readStoredUser()).toEqual(A_USER);
  });

  it('should forget a refresh token the API refuses', async () => {
    await writeRefreshToken(REFRESH_TOKEN);
    await writeStoredUser(A_USER);
    mockApi
      .onPost('/auth/refresh')
      .reply(...apiErrorReply(401, 'TOKEN_REVOKED'));

    await bootstrapSession();

    expect(useSessionStore.getState().status).toBe('anonymous');
    expect(await readRefreshToken()).toBeNull();
    expect(await readStoredUser()).toBeNull();
  });

  it('should open offline with the stored account and refresh once back online', async () => {
    await writeRefreshToken(REFRESH_TOKEN);
    await writeStoredUser(A_USER);
    mockApi.onPost('/auth/refresh').networkErrorOnce();
    onlineManager.setOnline(false);

    await bootstrapSession();
    expect(useSessionStore.getState()).toMatchObject({
      status: 'authenticated',
      user: A_USER,
      accessToken: null,
    });

    answerRefreshAndAccount();
    onlineManager.setOnline(true);
    await waitFor(() => {
      expect(useSessionStore.getState().accessToken).toBe(ACCESS_TOKEN);
    });
  });

  it('should be anonymous offline without a stored account, keeping the token', async () => {
    await writeRefreshToken(REFRESH_TOKEN);
    mockApi.onPost('/auth/refresh').networkError();

    await bootstrapSession();

    expect(useSessionStore.getState().status).toBe('anonymous');
    expect(await readRefreshToken()).toBe(REFRESH_TOKEN);
  });
});

describe('When we log in and out', () => {
  it('should start the session with the tokens and the account', async () => {
    answerRefreshAndAccount();

    await startSession(TOKENS);

    expect(useSessionStore.getState().user).toEqual(A_USER);
    expect(await readRefreshToken()).toBe(TOKENS.refreshToken);
  });

  it('should revoke the refresh token and clear everything', async () => {
    await writeRefreshToken(REFRESH_TOKEN);
    await writeStoredUser(A_USER);
    let revoked: unknown = null;
    mockApi.onPost('/auth/logout').reply((config) => {
      revoked = JSON.parse(config.data as string);
      return [204];
    });

    await logout();

    expect(revoked).toEqual({ refreshToken: REFRESH_TOKEN });
    expect(useSessionStore.getState().status).toBe('anonymous');
    expect(await readStoredUser()).toBeNull();
  });

  it('should clear the session even when the API can not revoke the token', async () => {
    await writeRefreshToken(REFRESH_TOKEN);
    mockApi.onPost('/auth/logout').networkError();

    await logout();

    expect(await readRefreshToken()).toBeNull();
  });

  it('should only clear the session when there is no refresh token', async () => {
    await logout();

    expect(useSessionStore.getState().status).toBe('anonymous');
  });
});

describe('When a request finds the access token expired', () => {
  it('should refresh through the session and retry with the new token', async () => {
    setUpSession();
    useSessionStore.setState({ accessToken: 'old', userId: USER_ID });
    await writeRefreshToken(REFRESH_TOKEN);
    mockApi.onPost('/auth/refresh').reply(200, TOKENS);
    mockApi
      .onGet('/movies')
      .reply((config) =>
        authorizationOf(config) === `Bearer ${ACCESS_TOKEN}`
          ? [200, { items: [] }]
          : apiErrorReply(401, 'TOKEN_EXPIRED'),
      );

    const { data } = await apiClient.get<unknown>('/movies');

    expect(data).toEqual({ items: [] });
  });

  it('should end the session when there is no refresh token', async () => {
    setUpSession();
    useSessionStore.setState({ status: 'authenticated', accessToken: 'old' });
    mockApi.onGet('/movies').reply(...apiErrorReply(401, 'TOKEN_EXPIRED'));

    await expect(apiClient.get('/movies')).rejects.toMatchObject({
      code: 'INVALID_TOKEN',
    });
    await waitFor(() => {
      expect(useSessionStore.getState().status).toBe('anonymous');
    });
  });
});

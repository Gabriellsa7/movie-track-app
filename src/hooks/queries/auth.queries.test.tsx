import { act, renderHook, waitFor } from '@testing-library/react-native';
import {
  readRefreshToken,
  writeRefreshToken,
} from '@/lib/session/session.storage';
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ID } from '@/test/constants';
import { A_USER } from '@/test/fixtures';
import { mockApi } from '@/test/mock-api';
import { createWrapper } from '@/test/render';
import { useSessionStore } from '@/stores/session.store';
import {
  useDeleteAccountMutation,
  useLoginMutation,
  useLogoutMutation,
  useRequestPasswordResetMutation,
  useResendVerificationMutation,
  useResetPasswordMutation,
  useSignUpMutation,
  useVerifyEmailMutation,
} from './auth.queries';

const TOKENS = { accessToken: ACCESS_TOKEN, refreshToken: REFRESH_TOKEN };

function renderAuthHooks() {
  return renderHook(
    () => ({
      login: useLoginMutation(),
      signUp: useSignUpMutation(),
      logout: useLogoutMutation(),
      verify: useVerifyEmailMutation(),
      forgot: useRequestPasswordResetMutation(),
      reset: useResetPasswordMutation(),
      resend: useResendVerificationMutation(),
      remove: useDeleteAccountMutation(),
    }),
    { wrapper: createWrapper() },
  );
}

describe('When we log in or sign up', () => {
  it('should start the session', async () => {
    mockApi.onPost('/users').reply(201, A_USER);
    mockApi.onPost('/auth/login').reply(200, TOKENS);
    mockApi.onGet(`/users/${USER_ID}/account`).reply(200, A_USER);
    mockApi.onPost('/auth/logout').reply(204);
    const { result } = await renderAuthHooks();

    await act(async () => {
      await result.current.signUp.mutateAsync({
        name: 'Gabriel',
        email: A_USER.email,
        password: 'filmes2026',
      });
    });
    expect(useSessionStore.getState().status).toBe('authenticated');

    await act(async () => {
      await result.current.logout.mutateAsync();
      await result.current.login.mutateAsync({
        email: A_USER.email,
        password: 'filmes2026',
      });
    });
    expect(useSessionStore.getState().user).toEqual(A_USER);
  });
});

describe('When we use the e-mail and password flows', () => {
  it('should call the API for each one', async () => {
    useSessionStore.setState({ userId: USER_ID });
    mockApi.onPost('/auth/verify-email').reply(204);
    mockApi.onPost('/auth/forgot-password').reply(204);
    mockApi.onPost('/auth/reset-password').reply(204);
    mockApi.onPost(`/users/${USER_ID}/email-verification`).reply(204);
    const { result } = await renderAuthHooks();

    await act(async () => {
      await result.current.verify.mutateAsync('token');
      await result.current.forgot.mutateAsync(A_USER.email);
      await result.current.reset.mutateAsync({
        token: 'token',
        newPassword: 'filmes2026',
      });
      await result.current.resend.mutateAsync();
    });

    await waitFor(() => {
      expect(result.current.resend.isSuccess).toBe(true);
    });
  });
});

describe('When we delete the account', () => {
  it('should delete it and end the session', async () => {
    useSessionStore.setState({ userId: USER_ID, status: 'authenticated' });
    await writeRefreshToken(REFRESH_TOKEN);
    mockApi.onDelete(`/users/${USER_ID}`).reply(204);
    mockApi.onPost('/auth/logout').reply(204);
    const { result } = await renderAuthHooks();

    await act(async () => {
      await result.current.remove.mutateAsync('filmes2026');
    });

    expect(useSessionStore.getState().status).toBe('anonymous');
    expect(await readRefreshToken()).toBeNull();
  });

  it('should refuse account actions without a session', async () => {
    const { result } = await renderAuthHooks();

    await act(async () => {
      await expect(result.current.resend.mutateAsync()).rejects.toThrow(
        'Not logged in',
      );
      await expect(result.current.remove.mutateAsync('x')).rejects.toThrow(
        'Not logged in',
      );
    });
  });
});

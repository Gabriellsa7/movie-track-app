import { act, renderHook, waitFor } from '@testing-library/react-native';
import {
  readRefreshToken,
  readStoredUser,
  writeRefreshToken,
} from '@/lib/session/session.storage';
import { REFRESH_TOKEN, USER_ID } from '@/test/constants';
import { A_USER } from '@/test/fixtures';
import { mockApi } from '@/test/mock-api';
import { createWrapper } from '@/test/render';
import { useSessionStore } from '@/stores/session.store';
import { useDeleteAccountMutation } from './delete-account';
import { useRemoveAvatarMutation } from './delete-avatar';
import { useChangePasswordMutation } from './patch-password';
import { useResendVerificationMutation } from './post-email-verification';
import { useUpdateAccountMutation } from './put-account';
import { useUploadAvatarMutation } from './put-avatar';

function renderAccountHooks() {
  return renderHook(
    () => ({
      update: useUpdateAccountMutation(),
      upload: useUploadAvatarMutation(),
      removeAvatar: useRemoveAvatarMutation(),
      password: useChangePasswordMutation(),
      resend: useResendVerificationMutation(),
      remove: useDeleteAccountMutation(),
    }),
    { wrapper: createWrapper() },
  );
}

describe('When we change my account', () => {
  it('should keep the session and the stored account in sync', async () => {
    useSessionStore.setState({ userId: USER_ID, status: 'authenticated' });
    const updated = { ...A_USER, name: 'Gabi' };
    mockApi.onPut(`/users/${USER_ID}`).reply(200, updated);
    mockApi.onPut(`/users/${USER_ID}/avatar`).reply(200, updated);
    mockApi.onDelete(`/users/${USER_ID}/avatar`).reply(200, updated);
    mockApi.onPatch(`/users/${USER_ID}/password`).reply(204);
    mockApi.onPost(`/users/${USER_ID}/email-verification`).reply(204);
    const { result } = await renderAccountHooks();

    await act(async () => {
      await result.current.update.mutateAsync({ name: 'Gabi' });
      await result.current.upload.mutateAsync({
        uri: 'file:///a.png',
        name: 'a.png',
        type: 'image/png',
      });
      await result.current.removeAvatar.mutateAsync(undefined);
      await result.current.password.mutateAsync({
        currentPassword: 'a',
        newPassword: 'b',
      });
      await result.current.resend.mutateAsync();
    });

    expect(useSessionStore.getState().user).toEqual(updated);
    expect(await readStoredUser()).toEqual(updated);
    await waitFor(() => {
      expect(result.current.resend.isSuccess).toBe(true);
    });
  });

  it('should delete it and end the session', async () => {
    useSessionStore.setState({ userId: USER_ID, status: 'authenticated' });
    await writeRefreshToken(REFRESH_TOKEN);
    mockApi.onDelete(`/users/${USER_ID}`).reply(204);
    mockApi.onPost('/auth/logout').reply(204);
    const { result } = await renderAccountHooks();

    await act(async () => {
      await result.current.remove.mutateAsync('filmes2026');
    });

    expect(useSessionStore.getState().status).toBe('anonymous');
    expect(await readRefreshToken()).toBeNull();
  });

  it('should refuse without a session', async () => {
    const { result } = await renderAccountHooks();

    await act(async () => {
      await expect(
        result.current.update.mutateAsync({ name: 'x' }),
      ).rejects.toThrow('Not logged in');
      await expect(
        result.current.password.mutateAsync({
          currentPassword: 'a',
          newPassword: 'b',
        }),
      ).rejects.toThrow('Not logged in');
      await expect(result.current.resend.mutateAsync()).rejects.toThrow(
        'Not logged in',
      );
      await expect(result.current.remove.mutateAsync('x')).rejects.toThrow(
        'Not logged in',
      );
    });
  });
});

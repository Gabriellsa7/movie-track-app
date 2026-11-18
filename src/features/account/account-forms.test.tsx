import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { toast } from 'sonner-native';
import { useSessionStore } from '@/stores/session.store';
import { USER_ID } from '@/test/constants';
import { A_USER } from '@/test/fixtures';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { AccountDetailsScreen } from './account-details/account-details';
import { AccountPasswordScreen } from './account-password/account-password';

async function renderForm(path: 'account/details' | 'account/password') {
  useSessionStore.setState({
    userId: USER_ID,
    user: A_USER,
    status: 'authenticated',
  });
  const client = createTestQueryClient();
  const Screen =
    path === 'account/details' ? AccountDetailsScreen : AccountPasswordScreen;
  await renderRouter(
    {
      index: () => null,
      [path]: () => (
        <QueryClientProvider client={client}>
          <Screen />
        </QueryClientProvider>
      ),
    },
    { initialUrl: `/${path}` },
  );
}

function save() {
  return fireEvent.press(screen.getByRole('button', { name: 'Save' }));
}

beforeEach(() => {
  jest.mocked(toast.success).mockClear();
});

describe('When we change our name', () => {
  it('should send only the name and update the session', async () => {
    mockApi
      .onPut(`/users/${USER_ID}`)
      .reply(200, { ...A_USER, name: 'Gabriel Santana' });
    await renderForm('account/details');

    await fireEvent.changeText(
      screen.getByLabelText('Name'),
      'Gabriel Santana',
    );
    expect(screen.queryByLabelText('Current password')).toBeNull();
    await save();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Account updated');
    });
    expect(JSON.parse(mockApi.history.put[0]?.data as string)).toEqual({
      name: 'Gabriel Santana',
    });
    expect(useSessionStore.getState().user?.name).toBe('Gabriel Santana');
  });
});

describe('When we change our e-mail', () => {
  it('should ask for the current password before saving', async () => {
    await renderForm('account/details');

    await fireEvent.changeText(
      screen.getByLabelText('E-mail'),
      'new@email.com',
    );
    await save();

    expect(
      await screen.findByText('Enter your password to change the e-mail'),
    ).toBeOnTheScreen();
    expect(mockApi.history.put).toHaveLength(0);
  });

  it('should send it with the password and warn when it is taken', async () => {
    mockApi
      .onPut(`/users/${USER_ID}`)
      .reply(...apiErrorReply(409, 'EMAIL_TAKEN'));
    await renderForm('account/details');

    await fireEvent.changeText(
      screen.getByLabelText('E-mail'),
      'new@email.com',
    );
    await fireEvent.changeText(
      screen.getByLabelText('Current password'),
      'secret123',
    );
    await save();

    expect(
      await screen.findByText('This e-mail is already in use'),
    ).toBeOnTheScreen();
    expect(JSON.parse(mockApi.history.put[0]?.data as string)).toEqual({
      name: 'Gabriel',
      email: 'new@email.com',
      currentPassword: 'secret123',
    });
  });
});

describe('When we change our password', () => {
  async function fill(current: string, next: string, confirm = next) {
    await fireEvent.changeText(
      screen.getByLabelText('Current password'),
      current,
    );
    await fireEvent.changeText(screen.getByLabelText('New password'), next);
    await fireEvent.changeText(
      screen.getByLabelText('Confirm the new password'),
      confirm,
    );
  }

  it('should send the current and the new password', async () => {
    mockApi.onPatch(`/users/${USER_ID}/password`).reply(204);
    await renderForm('account/password');

    await fill('secret123', 'newSecret1');
    await save();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Password changed');
    });
    expect(JSON.parse(mockApi.history.patch[0]?.data as string)).toEqual({
      currentPassword: 'secret123',
      newPassword: 'newSecret1',
    });
  });

  it('should check the confirmation before calling the API', async () => {
    await renderForm('account/password');

    await fill('secret123', 'newSecret1', 'other1234');
    await save();

    expect(
      await screen.findByText("The passwords don't match"),
    ).toBeOnTheScreen();
    expect(mockApi.history.patch).toHaveLength(0);
  });

  it('should say when the current password is wrong', async () => {
    mockApi
      .onPatch(`/users/${USER_ID}/password`)
      .reply(...apiErrorReply(401, 'INVALID_CREDENTIALS'));
    await renderForm('account/password');

    await fill('wrong123', 'newSecret1');
    await save();

    expect(await screen.findByText('Wrong password')).toBeOnTheScreen();
  });
});

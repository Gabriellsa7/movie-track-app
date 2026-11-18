import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { Text } from 'react-native';
import { toast } from 'sonner-native';
import { useSessionStore } from '@/stores/session.store';
import { useThemeStore } from '@/stores/theme.store';
import { USER_ID } from '@/test/constants';
import { A_USER } from '@/test/fixtures';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { AccountScreen } from './account';

async function renderAccount(user = A_USER) {
  useSessionStore.setState({
    userId: USER_ID,
    user,
    status: 'authenticated',
  });
  mockApi.onGet(`/users/${USER_ID}/account`).reply(200, user);
  const client = createTestQueryClient();
  await renderRouter(
    {
      index: () => (
        <QueryClientProvider client={client}>
          <AccountScreen />
        </QueryClientProvider>
      ),
      'account/details': () => <Text>Details screen</Text>,
      'account/password': () => <Text>Password screen</Text>,
      'users/[userId]/index': () => <Text>Public profile</Text>,
    },
    { initialUrl: '/' },
  );
}

beforeEach(() => {
  jest.mocked(toast.success).mockClear();
  useThemeStore.setState({ preference: 'dark' });
});

describe('When we open our account', () => {
  it('should show who we are and that the e-mail is not confirmed', async () => {
    await renderAccount();

    expect(screen.getByText('Gabriel')).toBeOnTheScreen();
    expect(screen.getByText('gabriel@email.com')).toBeOnTheScreen();
    expect(screen.getByText('E-mail not confirmed yet')).toBeOnTheScreen();
  });

  it('should hide the warning once the e-mail is confirmed', async () => {
    await renderAccount({ ...A_USER, emailVerified: true });

    expect(screen.queryByText('E-mail not confirmed yet')).toBeNull();
  });

  it('should resend the confirmation link', async () => {
    mockApi.onPost(`/users/${USER_ID}/email-verification`).reply(204);
    await renderAccount();

    await fireEvent.press(screen.getByRole('button', { name: 'Resend' }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'We sent a new link to gabriel@email.com',
      );
    });
  });

  it('should open the name and e-mail screen', async () => {
    await renderAccount();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Name and e-mail' }),
    );
    expect(await screen.findByText('Details screen')).toBeOnTheScreen();
  });

  it('should switch the theme', async () => {
    await renderAccount();

    await fireEvent.press(screen.getByRole('radio', { name: 'Light' }));

    expect(useThemeStore.getState().preference).toBe('light');
  });

  it('should remove the photo from the photo sheet', async () => {
    const withPhoto = {
      ...A_USER,
      avatarUrl: 'https://cdn.example.com/avatar.png',
    };
    mockApi
      .onDelete(`/users/${USER_ID}/avatar`)
      .reply(200, { ...withPhoto, avatarUrl: undefined });
    await renderAccount(withPhoto);

    await fireEvent.press(screen.getByRole('button', { name: 'Change photo' }));
    await fireEvent.press(
      await screen.findByRole('button', { name: 'Remove photo' }),
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Photo removed');
    });
  });
});

describe('When we delete our account', () => {
  it('should ask for the password and say when it is wrong', async () => {
    mockApi
      .onDelete(`/users/${USER_ID}`)
      .reply(...apiErrorReply(401, 'INVALID_CREDENTIALS'));
    await renderAccount();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Delete account' }),
    );
    await fireEvent.press(
      await screen.findByRole('button', { name: 'Delete my account' }),
    );
    expect(await screen.findByText('Enter your password')).toBeOnTheScreen();

    await fireEvent.changeText(screen.getByLabelText('Password'), 'wrong1');
    await fireEvent.press(
      screen.getByRole('button', { name: 'Delete my account' }),
    );

    expect(await screen.findByText('Wrong password')).toBeOnTheScreen();
    expect(JSON.parse(mockApi.history.delete[0]?.data as string)).toEqual({
      password: 'wrong1',
    });
  });
});

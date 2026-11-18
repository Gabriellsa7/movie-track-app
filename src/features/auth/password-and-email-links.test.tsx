import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { Text } from 'react-native';
import { toast } from 'sonner-native';
import { useSessionStore } from '@/stores/session.store';
import { USER_ID } from '@/test/constants';
import { A_USER } from '@/test/fixtures';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { ForgotPasswordScreen } from './forgot-password/forgot-password';
import { ResetPasswordScreen } from './reset-password/reset-password';
import { VerifyEmailScreen } from './verify-email/verify-email';

async function renderAt(initialUrl: string) {
  const client = createTestQueryClient();
  await renderRouter(
    {
      index: () => <Text>Home screen</Text>,
      login: () => <Text>Login screen</Text>,
      'forgot-password': () => (
        <QueryClientProvider client={client}>
          <ForgotPasswordScreen />
        </QueryClientProvider>
      ),
      'reset-password': () => (
        <QueryClientProvider client={client}>
          <ResetPasswordScreen />
        </QueryClientProvider>
      ),
      'verify-email': () => (
        <QueryClientProvider client={client}>
          <VerifyEmailScreen />
        </QueryClientProvider>
      ),
    },
    { initialUrl },
  );
}

beforeEach(() => {
  jest.mocked(toast.success).mockClear();
  useSessionStore.setState({ status: 'anonymous', user: null, userId: null });
});

describe('When we forget our password', () => {
  it('should send the link and make us wait before sending another', async () => {
    mockApi.onPost('/auth/forgot-password').reply(204);
    await renderAt('/forgot-password');

    await fireEvent.changeText(
      screen.getByLabelText('E-mail'),
      'Gabriel@Email.com ',
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Send link' }));

    expect(await screen.findByText('Check your inbox')).toBeOnTheScreen();
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toEqual({
      email: 'gabriel@email.com',
    });
    expect(
      screen.getByRole('button', { name: /^Resend in 1:00|^Resend in 0:5/ }),
    ).toBeDisabled();
  });

  it('should warn when there were too many requests', async () => {
    mockApi
      .onPost('/auth/forgot-password')
      .reply(...apiErrorReply(429, 'TOO_MANY_REQUESTS'));
    await renderAt('/forgot-password');

    await fireEvent.changeText(
      screen.getByLabelText('E-mail'),
      'gabriel@email.com',
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Send link' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Too many attempts. Wait a few minutes and try again.',
      );
    });
  });
});

describe('When we open the password reset link', () => {
  it('should save the new password and send us to the login', async () => {
    mockApi.onPost('/auth/reset-password').reply(204);
    await renderAt('/reset-password?token=reset-token');

    await fireEvent.changeText(
      screen.getByLabelText('New password'),
      'cinema99',
    );
    await fireEvent.changeText(
      screen.getByLabelText('Confirm the new password'),
      'cinema99',
    );
    await fireEvent.press(
      screen.getByRole('button', { name: 'Save new password' }),
    );

    expect(await screen.findByText('Login screen')).toBeOnTheScreen();
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toEqual({
      token: 'reset-token',
      newPassword: 'cinema99',
    });
    expect(toast.success).toHaveBeenCalledWith(
      'Password changed. Log in with the new one.',
    );
  });

  it('should offer a new link when this one expired', async () => {
    mockApi
      .onPost('/auth/reset-password')
      .reply(...apiErrorReply(422, 'INVALID_RESET_TOKEN'));
    await renderAt('/reset-password?token=old-token');

    await fireEvent.changeText(
      screen.getByLabelText('New password'),
      'cinema99',
    );
    await fireEvent.changeText(
      screen.getByLabelText('Confirm the new password'),
      'cinema99',
    );
    await fireEvent.press(
      screen.getByRole('button', { name: 'Save new password' }),
    );

    expect(
      await screen.findByRole('link', { name: 'Request another link' }),
    ).toBeOnTheScreen();
  });

  it('should not show the form without a token', async () => {
    await renderAt('/reset-password');

    expect(screen.queryByLabelText('New password')).toBeNull();
    expect(
      screen.getByRole('link', { name: 'Request another link' }),
    ).toBeOnTheScreen();
  });
});

describe('When we open the e-mail confirmation link', () => {
  it('should confirm it right away and update our account', async () => {
    useSessionStore.setState({
      status: 'authenticated',
      userId: USER_ID,
      user: A_USER,
    });
    mockApi.onPost('/auth/verify-email').reply(204);
    await renderAt('/verify-email?token=verify-token');

    expect(await screen.findByText('E-mail confirmed')).toBeOnTheScreen();
    expect(screen.getByText('gabriel@email.com')).toBeOnTheScreen();
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toEqual({
      token: 'verify-token',
    });
    expect(useSessionStore.getState().user?.emailVerified).toBe(true);

    await fireEvent.press(screen.getByRole('button', { name: 'Go to home' }));
    expect(await screen.findByText('Home screen')).toBeOnTheScreen();
  });

  it('should say when the link expired', async () => {
    mockApi
      .onPost('/auth/verify-email')
      .reply(...apiErrorReply(422, 'INVALID_VERIFICATION_TOKEN'));
    await renderAt('/verify-email?token=old-token');

    expect(
      await screen.findByText(/This link is invalid, was already used/),
    ).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeOnTheScreen();
  });
});

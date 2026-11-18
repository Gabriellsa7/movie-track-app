import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { toast } from 'sonner-native';
import { startSession } from '@/lib/session/session';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { LoginForm } from './login-form';

jest.mock('@/lib/session/session', () => ({ startSession: jest.fn() }));

const TOKENS = { accessToken: 'access', refreshToken: 'refresh' };

async function renderForm() {
  await renderRouter({ index: () => <LoginForm /> });
}

async function fillAndSubmit(email: string, password: string) {
  await fireEvent.changeText(screen.getByLabelText('E-mail'), email);
  await fireEvent.changeText(screen.getByLabelText('Password'), password);
  await fireEvent.press(screen.getByRole('button', { name: 'Log in' }));
}

describe('When we submit the login form', () => {
  it('should show the field errors and not call the API', async () => {
    await renderForm();

    await fillAndSubmit('not-an-email', '');

    expect(await screen.findByText('Enter a valid e-mail')).toBeOnTheScreen();
    expect(screen.getByText('Enter your password')).toBeOnTheScreen();
    expect(mockApi.history.post).toHaveLength(0);
  });

  it('should start the session with the tokens the API returns', async () => {
    mockApi.onPost('/auth/login').reply(200, TOKENS);
    await renderForm();

    await fillAndSubmit(' Gabriel@Email.com ', 'senha1234');

    await waitFor(() => {
      expect(startSession).toHaveBeenCalledWith(TOKENS);
    });
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toEqual({
      email: 'gabriel@email.com',
      password: 'senha1234',
    });
  });

  it('should tell the user when the credentials are wrong', async () => {
    mockApi
      .onPost('/auth/login')
      .reply(...apiErrorReply(401, 'INVALID_CREDENTIALS'));
    await renderForm();

    await fillAndSubmit('gabriel@email.com', 'errada123');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Wrong e-mail or password',
    );
    expect(toast.error).toHaveBeenCalledWith('Wrong e-mail or password');
  });

  it('should warn in a toast when the server cannot be reached', async () => {
    mockApi.onPost('/auth/login').networkError();
    await renderForm();

    await fillAndSubmit('gabriel@email.com', 'senha1234');

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Can't reach the server. Check your connection and try again.",
      );
    });
  });

  it('should show a generic message on any other failure', async () => {
    mockApi.onPost('/auth/login').reply(500);
    await renderForm();

    await fillAndSubmit('gabriel@email.com', 'senha1234');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Couldn't log in. Try again.",
    );
  });

  it('should show the forgot password link', async () => {
    await renderForm();

    expect(screen.getByText('Forgot password')).toBeOnTheScreen();
  });
});

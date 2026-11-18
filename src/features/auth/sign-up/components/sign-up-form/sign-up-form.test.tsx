import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { toast } from 'sonner-native';
import { startSession } from '@/lib/session/session';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { SignUpForm } from './sign-up-form';

jest.mock('@/lib/session/session', () => ({ startSession: jest.fn() }));

const TOKENS = { accessToken: 'access', refreshToken: 'refresh' };

async function renderForm() {
  await renderRouter({ index: () => <SignUpForm /> });
}

async function fillAndSubmit(name: string, email: string, password: string) {
  await fireEvent.changeText(screen.getByLabelText('Name or nickname'), name);
  await fireEvent.changeText(screen.getByLabelText('E-mail'), email);
  await fireEvent.changeText(screen.getByLabelText('Password'), password);
  await fireEvent.press(screen.getByRole('button', { name: 'Sign up' }));
}

describe('When we submit the sign-up form', () => {
  it('should show the field errors and not call the API', async () => {
    await renderForm();

    await fillAndSubmit(' ', 'not-an-email', 'filmes');

    expect(
      await screen.findByText('Use at least 2 characters'),
    ).toBeOnTheScreen();
    expect(screen.getByText('Enter a valid e-mail')).toBeOnTheScreen();
    expect(screen.getByText('Use at least 8 characters')).toBeOnTheScreen();
    expect(mockApi.history.post).toHaveLength(0);
  });

  it('should create the account, log in and start the session', async () => {
    mockApi.onPost('/users').reply(201, { id: 'user-id' });
    mockApi.onPost('/auth/login').reply(200, TOKENS);
    await renderForm();

    await fillAndSubmit('Gabriel', ' Gabriel@Email.com ', 'filmes123');

    await waitFor(() => {
      expect(startSession).toHaveBeenCalledWith(TOKENS);
    });
    expect(JSON.parse(mockApi.history.post[0]?.data as string)).toEqual({
      name: 'Gabriel',
      email: 'gabriel@email.com',
      password: 'filmes123',
    });
    expect(JSON.parse(mockApi.history.post[1]?.data as string)).toEqual({
      email: 'gabriel@email.com',
      password: 'filmes123',
    });
  });

  it('should show the taken e-mail under its field', async () => {
    mockApi.onPost('/users').reply(...apiErrorReply(409, 'EMAIL_TAKEN'));
    await renderForm();

    await fillAndSubmit('Gabriel', 'gabriel@email.com', 'filmes123');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'This e-mail already has an account',
    );
    expect(toast.error).toHaveBeenCalledWith(
      'This e-mail already has an account',
    );
  });

  it('should warn in a toast when the API rejects the name', async () => {
    mockApi.onPost('/users').reply(400, {
      message: 'Validation failed',
      status: 400,
      code: 'VALIDATION_ERROR',
      errors: [
        { field: 'name', message: 'must NOT have more than 80 characters' },
      ],
    });
    await renderForm();

    await fillAndSubmit('Gabriel', 'gabriel@email.com', 'filmes123');

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid name');
    });
  });

  it('should show a generic message on any other failure', async () => {
    mockApi.onPost('/users').reply(500);
    await renderForm();

    await fillAndSubmit('Gabriel', 'gabriel@email.com', 'filmes123');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Couldn't create the account. Try again.",
    );
  });

  it('should check the password rules while typing', async () => {
    await renderForm();

    await fireEvent.changeText(screen.getByLabelText('Password'), 'filmes');

    const checked = (label: string) =>
      screen.getByLabelText(label).props.accessibilityState as {
        checked: boolean;
      };
    expect(checked('Between 8 and 72 characters')).toEqual({ checked: false });
    expect(checked('At least one letter')).toEqual({ checked: true });
    expect(checked('At least one number')).toEqual({ checked: false });
  });
});

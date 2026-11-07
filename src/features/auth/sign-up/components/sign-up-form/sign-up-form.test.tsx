import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { startSession } from '@/lib/session/session';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { SignUpForm } from './sign-up-form';

jest.mock('@/lib/session/session', () => ({ startSession: jest.fn() }));

const TOKENS = { accessToken: 'access', refreshToken: 'refresh' };

async function renderForm() {
  await renderRouter({ index: () => <SignUpForm /> });
}

async function fillAndSubmit(name: string, email: string, password: string) {
  await fireEvent.changeText(screen.getByLabelText('Nome ou apelido'), name);
  await fireEvent.changeText(screen.getByLabelText('E-mail'), email);
  await fireEvent.changeText(screen.getByLabelText('Senha'), password);
  await fireEvent.press(screen.getByRole('button', { name: 'Criar conta' }));
}

describe('When we submit the sign-up form', () => {
  it('should show the field errors and not call the API', async () => {
    await renderForm();

    await fillAndSubmit(' ', 'not-an-email', 'filmes');

    expect(
      await screen.findByText('Use pelo menos 2 caracteres'),
    ).toBeOnTheScreen();
    expect(screen.getByText('Informe um e-mail válido')).toBeOnTheScreen();
    expect(screen.getByText('Use pelo menos 8 caracteres')).toBeOnTheScreen();
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
      'Este e-mail já tem uma conta',
    );
  });

  it('should show a generic message on any other failure', async () => {
    mockApi.onPost('/users').reply(500);
    await renderForm();

    await fillAndSubmit('Gabriel', 'gabriel@email.com', 'filmes123');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível criar a conta. Tente de novo.',
    );
  });

  it('should check the password rules while typing', async () => {
    await renderForm();

    await fireEvent.changeText(screen.getByLabelText('Senha'), 'filmes');

    const checked = (label: string) =>
      screen.getByLabelText(label).props.accessibilityState as {
        checked: boolean;
      };
    expect(checked('Entre 8 e 72 caracteres')).toEqual({ checked: false });
    expect(checked('Pelo menos uma letra')).toEqual({ checked: true });
    expect(checked('Pelo menos um número')).toEqual({ checked: false });
  });
});

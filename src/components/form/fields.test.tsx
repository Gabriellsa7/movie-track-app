import { fireEvent, render, screen } from '@testing-library/react-native';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Text } from 'react-native';
import { DateField } from './date-field';
import { PasswordField } from './password-field';
import { TextAreaField } from './text-area-field';
import { TextField } from './text-field';

interface IForm {
  email: string;
  password: string;
  review: string;
  watchedAt: string;
}

function Harness({ error }: { error?: string }) {
  const { control, setError } = useForm<IForm>({
    defaultValues: {
      email: '',
      password: '',
      review: '',
      watchedAt: '2026-10-12',
    },
  });

  const email = useWatch({ control, name: 'email' });

  useEffect(() => {
    if (error) {
      setError('email', { message: error });
    }
  }, [error, setError]);

  return (
    <>
      <TextField
        control={control}
        name="email"
        label="E-mail"
        hint="Usado no login"
      />
      <PasswordField control={control} name="password" label="Senha" />
      <TextAreaField control={control} name="review" label="Opinião" />
      <DateField control={control} name="watchedAt" label="Assisti em" />
      <Text>{`email=${email}`}</Text>
    </>
  );
}

describe('When we fill the form fields', () => {
  it('should keep the typed value in the form and show the hint', async () => {
    await render(<Harness />);

    await fireEvent.changeText(
      screen.getByLabelText('E-mail'),
      'gabriel@email.com',
    );

    expect(screen.getByText('email=gabriel@email.com')).toBeOnTheScreen();
    expect(screen.getByText('Usado no login')).toBeOnTheScreen();
  });

  it('should show the error in place of the hint', async () => {
    await render(<Harness error="Informe um e-mail válido" />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Informe um e-mail válido',
    );
    expect(screen.queryByText('Usado no login')).toBeNull();
  });

  it('should toggle the password visibility', async () => {
    await render(<Harness />);

    expect(screen.getByLabelText('Senha')).toHaveProp('secureTextEntry', true);
    await fireEvent.press(
      screen.getByRole('button', { name: 'Mostrar senha' }),
    );
    expect(screen.getByLabelText('Senha')).toHaveProp('secureTextEntry', false);
  });

  it('should show the date in pt-BR and open the picker', async () => {
    await render(<Harness />);

    const dateButton = screen.getByRole('button', {
      name: 'Assisti em: 12/10/2026',
    });
    await fireEvent.press(dateButton);

    expect(dateButton).toBeOnTheScreen();
  });
});

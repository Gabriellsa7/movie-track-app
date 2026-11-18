import { fireEvent, render, screen } from '@testing-library/react-native';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Text } from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { DateField } from './date-field';
import { PasswordField } from './password-field';
import { TextAreaField } from './text-area-field';
import { TextField } from './text-field';

const TEST_METRICS = initialWindowMetrics ?? {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

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
      <PasswordField control={control} name="password" label="Password" />
      <TextAreaField control={control} name="review" label="Review" />
      <DateField control={control} name="watchedAt" label="Watched on" />
      <Text>{`email=${email}`}</Text>
    </>
  );
}

describe('When we fill the form fields', () => {
  it('should keep the typed value in the form and show the hint', async () => {
    await render(
      <SafeAreaProvider initialMetrics={TEST_METRICS}>
        <Harness />
      </SafeAreaProvider>,
    );

    await fireEvent.changeText(
      screen.getByLabelText('E-mail'),
      'gabriel@email.com',
    );

    expect(screen.getByText('email=gabriel@email.com')).toBeOnTheScreen();
    expect(screen.getByText('Usado no login')).toBeOnTheScreen();
  });

  it('should show the error in place of the hint', async () => {
    await render(
      <SafeAreaProvider initialMetrics={TEST_METRICS}>
        <Harness error="Enter a valid e-mail" />
      </SafeAreaProvider>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid e-mail');
    expect(screen.queryByText('Usado no login')).toBeNull();
  });

  it('should toggle the password visibility', async () => {
    await render(
      <SafeAreaProvider initialMetrics={TEST_METRICS}>
        <Harness />
      </SafeAreaProvider>,
    );

    expect(screen.getByLabelText('Password')).toHaveProp(
      'secureTextEntry',
      true,
    );
    await fireEvent.press(
      screen.getByRole('button', { name: 'Show password' }),
    );
    expect(screen.getByLabelText('Password')).toHaveProp(
      'secureTextEntry',
      false,
    );
  });

  it('should show the date in English and pick another day in the calendar', async () => {
    await render(
      <SafeAreaProvider initialMetrics={TEST_METRICS}>
        <Harness />
      </SafeAreaProvider>,
    );

    await fireEvent.press(
      screen.getByRole('button', { name: 'Watched on: 10/12/2026' }),
    );
    expect(await screen.findByText('October 2026')).toBeOnTheScreen();
    await fireEvent.press(
      screen.getByRole('button', { name: 'Thursday, October 15' }),
    );

    expect(
      await screen.findByRole('button', { name: 'Watched on: 10/15/2026' }),
    ).toBeOnTheScreen();
  });
});

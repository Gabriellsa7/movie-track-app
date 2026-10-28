import { screen } from '@testing-library/react-native';
import { Stack } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';
import { Text } from 'react-native';
import { useSessionStore } from '@/stores/session.store';
import { RootStack } from './root-stack';

const screenWithText = (text: string) =>
  function MockScreen() {
    return <Text>{text}</Text>;
  };
const groupLayout = () => <Stack screenOptions={{ headerShown: false }} />;

// The route files the root stack declares, with stand-in screens.
const SCREENS = {
  _layout: () => <RootStack />,
  '(tabs)/_layout': groupLayout,
  '(tabs)/index': screenWithText('Início'),
  '(auth)/_layout': groupLayout,
  '(auth)/login': screenWithText('Entrar'),
  explore: screenWithText('Explorar'),
  'movies/new': screenWithText('Registrar filme'),
  'movies/[movieId]/index': screenWithText('Filme'),
  'movies/[movieId]/edit': screenWithText('Editar filme'),
  'watchlist/new': screenWithText('Adicionar à lista'),
  'watchlist/[itemId]/edit': screenWithText('Editar item'),
  'watchlist/[itemId]/watched': screenWithText('Assisti'),
  'reset-password': screenWithText('Nova senha'),
  'verify-email': screenWithText('Confirmar e-mail'),
  'users/[userId]/index': screenWithText('Perfil'),
  'users/[userId]/movies/[movieId]': screenWithText('Review'),
};

describe('When a visitor opens the app', () => {
  it('should send them from a private screen to the login', async () => {
    useSessionStore.setState({ status: 'anonymous' });

    await renderRouter(SCREENS, { initialUrl: '/' });

    expect(await screen.findByText('Entrar')).toBeOnTheScreen();
    expect(screen).toHavePathname('/login');
  });

  it('should open a public profile without logging in', async () => {
    useSessionStore.setState({ status: 'anonymous' });

    await renderRouter(SCREENS, { initialUrl: '/users/u1' });

    expect(await screen.findByText('Perfil')).toBeOnTheScreen();
  });
});

describe('When a logged user opens the login', () => {
  it('should send them to the home tab', async () => {
    useSessionStore.setState({ status: 'authenticated' });

    await renderRouter(SCREENS, { initialUrl: '/login' });

    expect(await screen.findByText('Início')).toBeOnTheScreen();
  });
});

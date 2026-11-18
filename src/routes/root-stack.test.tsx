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

const SCREENS = {
  _layout: () => <RootStack />,
  '(tabs)/_layout': groupLayout,
  '(tabs)/index': screenWithText('Home'),
  '(auth)/_layout': groupLayout,
  '(auth)/login': screenWithText('Log in'),
  explore: screenWithText('Explore'),
  'movies/new': screenWithText('Log a movie'),
  'movies/[movieId]/index': screenWithText('Movie'),
  'movies/[movieId]/edit': screenWithText('Edit movie'),
  'watchlist/new': screenWithText('Add to watchlist'),
  'watchlist/[itemId]/edit': screenWithText('Edit item'),
  'watchlist/[itemId]/watched': screenWithText('Watched it'),
  'reset-password': screenWithText('New password'),
  'verify-email': screenWithText('Confirm e-mail'),
  'users/[userId]/index': screenWithText('Profile'),
  'users/[userId]/movies/[movieId]': screenWithText('Review'),
};

describe('When a visitor opens the app', () => {
  it('should send them from a private screen to the login', async () => {
    useSessionStore.setState({ status: 'anonymous' });

    await renderRouter(SCREENS, { initialUrl: '/' });

    expect(await screen.findByText('Log in')).toBeOnTheScreen();
    expect(screen).toHavePathname('/login');
  });

  it('should open a public profile without logging in', async () => {
    useSessionStore.setState({ status: 'anonymous' });

    await renderRouter(SCREENS, { initialUrl: '/users/u1' });

    expect(await screen.findByText('Profile')).toBeOnTheScreen();
  });
});

describe('When a logged user opens the login', () => {
  it('should send them to the home tab', async () => {
    useSessionStore.setState({ status: 'authenticated' });

    await renderRouter(SCREENS, { initialUrl: '/login' });

    expect(await screen.findByText('Home')).toBeOnTheScreen();
  });
});

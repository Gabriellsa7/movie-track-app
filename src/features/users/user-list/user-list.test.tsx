import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { Text } from 'react-native';
import { USER_ID } from '@/test/constants';
import { mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { useSessionStore } from '@/stores/session.store';
import { UsersScreen } from './user-list';

const MARINA = {
  id: '64b7f0c2a1b2c3d4e5f607aa',
  name: 'Marina Costa',
  memberSince: '2025-03-02T10:00:00.000Z',
  moviesCount: 214,
  averageRating: 7.9,
  favoritesCount: 41,
};
const ME = { ...MARINA, id: USER_ID, name: 'Gabriel Santana' };
const NEWCOMER = {
  ...MARINA,
  id: '64b7f0c2a1b2c3d4e5f607bb',
  name: 'Paulo Henrique',
  moviesCount: 0,
  averageRating: null,
  favoritesCount: 0,
};

function page(items: object[]) {
  return { items, total: items.length, page: 1, limit: 50 };
}

async function renderUsers() {
  const client = createTestQueryClient();
  await renderRouter(
    {
      index: () => (
        <QueryClientProvider client={client}>
          <UsersScreen />
        </QueryClientProvider>
      ),
      'users/[userId]/index': () => <Text>Profile screen</Text>,
    },
    { initialUrl: '/' },
  );
}

beforeEach(() => {
  useSessionStore.setState({ userId: USER_ID });
});

describe('When we open the users', () => {
  it('should list the other people with their movies, date and average', async () => {
    mockApi.onGet('/users').reply(200, page([ME, MARINA, NEWCOMER]));
    await renderUsers();

    expect(await screen.findByText('Marina Costa')).toBeOnTheScreen();
    expect(screen.getByText('214 movies · since Mar 2025')).toBeOnTheScreen();
    expect(screen.getByText('7.9')).toBeOnTheScreen();
    expect(screen.getByText('0 movies · since Mar 2025')).toBeOnTheScreen();
    expect(screen.queryByText('Gabriel Santana')).toBeNull();
  });

  it('should search them by name', async () => {
    mockApi.onGet('/users').reply(200, page([MARINA]));
    await renderUsers();

    await fireEvent.changeText(screen.getByLabelText('Search by name'), 'mar');

    await waitFor(() => {
      expect(mockApi.history.get.at(-1)?.params).toEqual({
        limit: 50,
        search: 'mar',
      });
    });
  });

  it('should say when no one matches the search', async () => {
    mockApi.onGet('/users').reply(200, page([]));
    await renderUsers();

    await fireEvent.changeText(screen.getByLabelText('Search by name'), 'zz');

    expect(await screen.findByText('No one found for “zz”')).toBeOnTheScreen();
  });

  it('should offer a retry when the list fails', async () => {
    mockApi.onGet('/users').reply(500);
    await renderUsers();

    expect(
      await screen.findByText("Couldn't load the users."),
    ).toBeOnTheScreen();
  });

  it('should open a profile', async () => {
    mockApi.onGet('/users').reply(200, page([MARINA]));
    await renderUsers();

    await fireEvent.press(
      await screen.findByRole('link', { name: /^Marina Costa/ }),
    );

    expect(await screen.findByText('Profile screen')).toBeOnTheScreen();
  });
});

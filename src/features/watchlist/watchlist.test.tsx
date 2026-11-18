import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { Text } from 'react-native';
import { toast } from 'sonner-native';
import { ITEM_ID } from '@/test/constants';
import { A_WATCHLIST_ITEM } from '@/test/fixtures';
import { mockApi } from '@/test/mock-api';
import { createTestQueryClient } from '@/test/render';
import { WatchlistScreen } from './watchlist';

const PAGE = { page: 1, limit: 50 };
const UPCOMING = {
  ...A_WATCHLIST_ITEM,
  priority: 'high' as const,
  plannedFor: '2099-01-03T00:00:00.000Z',
  note: 'With Ana on Saturday',
};
const SOMEDAY = {
  ...A_WATCHLIST_ITEM,
  id: 'item-2',
  title: 'Past Lives',
  priority: 'low' as const,
  releaseYear: 2023,
};

function replyWithLists() {
  mockApi
    .onGet('/watchlist')
    .reply((config) =>
      (config.params as { planned?: boolean }).planned
        ? [200, { ...PAGE, total: 1, items: [UPCOMING] }]
        : [200, { ...PAGE, total: 1, items: [SOMEDAY] }],
    );
}

async function renderWatchlist() {
  const client = createTestQueryClient();
  await renderRouter(
    {
      index: () => (
        <QueryClientProvider client={client}>
          <WatchlistScreen />
        </QueryClientProvider>
      ),
      'watchlist/[itemId]/edit': () => <Text>Edit screen</Text>,
      'watchlist/[itemId]/watched': () => <Text>Watched screen</Text>,
    },
    { initialUrl: '/' },
  );
}

describe('When we open the watchlist', () => {
  it('should show the upcoming movies with their date, priority and note', async () => {
    replyWithLists();
    await renderWatchlist();

    expect(await screen.findAllByText('Perfect Days')).not.toHaveLength(0);
    expect(screen.getByText('Sat, Jan 3')).toBeOnTheScreen();
    expect(screen.getByLabelText('High priority')).toBeOnTheScreen();
    expect(screen.getByText('With Ana on Saturday')).toBeOnTheScreen();
    expect(screen.getByRole('tab', { name: 'Upcoming · 1' })).toBeOnTheScreen();
    expect(
      await screen.findByRole('tab', { name: 'Someday · 1' }),
    ).toBeOnTheScreen();
  });

  it('should switch to the movies without a date', async () => {
    replyWithLists();
    await renderWatchlist();

    await fireEvent.press(
      await screen.findByRole('tab', { name: 'Someday · 1' }),
    );

    expect(await screen.findAllByText('Past Lives')).not.toHaveLength(0);
    expect(screen.getByText('2023')).toBeOnTheScreen();
    expect(screen.getByLabelText('Low priority')).toBeOnTheScreen();
  });

  it('should say when a tab is empty', async () => {
    mockApi.onGet('/watchlist').reply(200, { ...PAGE, total: 0, items: [] });
    await renderWatchlist();

    expect(await screen.findByText('Nothing scheduled')).toBeOnTheScreen();
  });

  it('should offer a retry when the list fails', async () => {
    mockApi.onGet('/watchlist').reply(500);
    await renderWatchlist();

    expect(
      await screen.findByText("Couldn't load your watchlist."),
    ).toBeOnTheScreen();
  });
});

describe('When we act on a watchlist item', () => {
  it('should open the watched screen', async () => {
    replyWithLists();
    await renderWatchlist();

    await fireEvent.press(
      await screen.findByLabelText('Mark Perfect Days as watched'),
    );

    expect(await screen.findByText('Watched screen')).toBeOnTheScreen();
  });

  it('should remove it from the more options sheet', async () => {
    replyWithLists();
    mockApi.onDelete(`/watchlist/${ITEM_ID}`).reply(204);
    await renderWatchlist();

    await fireEvent.press(
      await screen.findByRole('button', {
        name: 'More options for Perfect Days',
      }),
    );
    await fireEvent.press(
      await screen.findByRole('button', { name: 'Remove from watchlist' }),
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Removed from your watchlist');
    });
  });

  it('should open the edit screen from the more options sheet', async () => {
    replyWithLists();
    await renderWatchlist();

    await fireEvent.press(
      await screen.findByRole('button', {
        name: 'More options for Perfect Days',
      }),
    );
    await fireEvent.press(await screen.findByRole('button', { name: 'Edit' }));

    expect(await screen.findByText('Edit screen')).toBeOnTheScreen();
  });
});

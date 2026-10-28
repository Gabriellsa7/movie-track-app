import { toast } from 'sonner-native';
import { apiClient } from '@/api/client';
import { apiErrorReply, mockApi } from '@/test/mock-api';
import { createQueryClient } from './query-client';

async function fetchWithClient(path: string) {
  const client = createQueryClient();
  await client
    .query({
      queryKey: [path],
      queryFn: () => apiClient.get(path),
      retryDelay: 0,
    })
    .catch(() => undefined);
}

describe('When a query fails', () => {
  it('should retry a 5xx once and not a 4xx', async () => {
    mockApi.onGet('/flaky').reply(...apiErrorReply(500, 'INTERNAL_ERROR'));
    mockApi.onGet('/missing').reply(...apiErrorReply(404, 'MOVIE_NOT_FOUND'));

    await fetchWithClient('/flaky');
    await fetchWithClient('/missing');

    const calls = mockApi.history.get.map((request) => request.url);
    expect(calls.filter((url) => url === '/flaky')).toHaveLength(2);
    expect(calls.filter((url) => url === '/missing')).toHaveLength(1);
  });

  it('should show one toast for a temporary failure and none when offline', async () => {
    mockApi.onGet('/down').reply(...apiErrorReply(503, 'SERVICE_UNAVAILABLE'));
    mockApi.onGet('/offline').networkError();

    await fetchWithClient('/down');
    await fetchWithClient('/offline');

    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(
      'Serviço indisponível no momento. Tente de novo em instantes.',
      { id: 'temporary-failure' },
    );
  });
});

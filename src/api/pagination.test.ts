import {
  cachedItems,
  mapCachedItems,
  nextPageParam,
  pagesItems,
  type IPage,
} from './pagination';

const page = (number: number, items: string[], total = 45): IPage<string> => ({
  items,
  total,
  page: number,
  limit: 20,
});

describe('When we page through a list', () => {
  it('should ask for the next page until every item was loaded', () => {
    expect(nextPageParam(page(1, ['a']))).toBe(2);
    expect(nextPageParam(page(2, ['b']))).toBe(3);
    expect(nextPageParam(page(3, ['c']))).toBeUndefined();
    expect(nextPageParam(page(1, [], 0))).toBeUndefined();
  });

  it('should join the loaded pages', () => {
    expect(
      pagesItems({
        pages: [page(1, ['a', 'b']), page(2, ['c'])],
        pageParams: [1, 2],
      }),
    ).toEqual(['a', 'b', 'c']);
    expect(pagesItems(undefined)).toBeUndefined();
  });
});

describe('When we read or change items in the cache', () => {
  const infinite = {
    pages: [page(1, ['a']), page(2, ['b'])],
    pageParams: [1, 2],
  };

  it('should read single pages and paged lists alike', () => {
    expect(cachedItems(page(1, ['a']))).toEqual(['a']);
    expect(cachedItems(infinite)).toEqual(['a', 'b']);
    expect(cachedItems(undefined)).toEqual([]);
  });

  it('should update single pages and paged lists alike', () => {
    const upper = (item: string) => item.toUpperCase();

    expect(mapCachedItems(page(1, ['a']), upper)).toMatchObject({
      items: ['A'],
    });
    expect(mapCachedItems(infinite, upper)).toMatchObject({
      pages: [{ items: ['A'] }, { items: ['B'] }],
    });
    expect(mapCachedItems(undefined, upper)).toBeUndefined();
  });
});

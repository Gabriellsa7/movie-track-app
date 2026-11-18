import type { InfiniteData } from '@tanstack/react-query';

export const PAGE_SIZE = 20;
export const FIRST_PAGE = 1;

export interface IPage<TItem> {
  items: TItem[];
  total: number;
  page: number;
  limit: number;
}

export type TCachedPages<TItem> =
  IPage<TItem> | InfiniteData<IPage<TItem>> | undefined;

export function nextPageParam<TItem>(
  lastPage: IPage<TItem>,
): number | undefined {
  return lastPage.page * lastPage.limit < lastPage.total
    ? lastPage.page + 1
    : undefined;
}

export function pagesItems<TItem>(
  data: InfiniteData<IPage<TItem>> | undefined,
): TItem[] | undefined {
  return data?.pages.flatMap((page) => page.items);
}

function isInfinite<TItem>(
  data: TCachedPages<TItem>,
): data is InfiniteData<IPage<TItem>> {
  return Array.isArray((data as { pages?: unknown } | undefined)?.pages);
}

function isPage<TItem>(data: TCachedPages<TItem>): data is IPage<TItem> {
  return Array.isArray((data as { items?: unknown } | undefined)?.items);
}

export function cachedItems<TItem>(data: TCachedPages<TItem>): TItem[] {
  if (isInfinite(data)) {
    return data.pages.flatMap((page) => page.items);
  }
  return isPage(data) ? data.items : [];
}

export function mapCachedItems<TItem>(
  data: TCachedPages<TItem>,
  update: (item: TItem) => TItem,
): TCachedPages<TItem> {
  const mapPage = (page: IPage<TItem>) => ({
    ...page,
    items: page.items.map(update),
  });
  if (isInfinite(data)) {
    return { ...data, pages: data.pages.map(mapPage) };
  }
  return isPage(data) ? mapPage(data) : data;
}

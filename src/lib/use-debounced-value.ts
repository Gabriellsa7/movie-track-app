import { useEffect, useState } from 'react';

export function useDebouncedValue<TValue>(
  value: TValue,
  delayMilliseconds: number,
): TValue {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(value);
    }, delayMilliseconds);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delayMilliseconds]);

  return debounced;
}

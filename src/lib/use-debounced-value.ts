import { useEffect, useState } from 'react';

// The value only changes after it stays the same for `delayMilliseconds`, e.g. a search
// input that should not send one request per keystroke.
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

import { useEffect, useState } from 'react';

const SECOND_IN_MILLISECONDS = 1000;

export function useCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setSecondsLeft((seconds) => seconds - 1);
    }, SECOND_IN_MILLISECONDS);
    return () => {
      clearTimeout(timer);
    };
  }, [secondsLeft]);

  return { secondsLeft, start: setSecondsLeft };
}

export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes)}:${String(seconds).padStart(2, '0')}`;
}

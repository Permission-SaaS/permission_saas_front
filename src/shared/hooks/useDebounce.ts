import { useEffect, useState } from "react";

const DEFAULT_DELAY_MS = 400;

export const useDebounce = <T>(value: T, delay = DEFAULT_DELAY_MS) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

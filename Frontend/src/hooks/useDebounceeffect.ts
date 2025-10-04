import { useEffect } from "react";

/**
 * Runs the callback after the given delay whenever `value` changes.
 * Cancels the previous timeout if the value changes before delay ends.
 */
export default function useDebounceEffect<T>(
  value: T,
  delay: number,
  callback: (val: T) => void
) {
  useEffect(() => {
    const handler = setTimeout(() => callback(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay, callback]);
}

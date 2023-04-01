import { useEffect, useRef } from "react";

export const useDebounceCallback = (delay = 100, cleaning = true) => { // or: delayed debounce callback
  const ref = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
      if (cleaning) {
          // cleaning uncalled delayed callback with component destroying
          return () => {
              if (ref.current) clearTimeout(ref.current);
          };
      }
  }, []);
  return (callback: () => void | Promise<void>) => {
      if (ref.current) clearTimeout(ref.current);
      ref.current = setTimeout(callback, delay);
  };
};
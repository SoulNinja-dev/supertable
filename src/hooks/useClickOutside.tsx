import { useEffect } from "react";

type Options = {
  closeOnEscape?: boolean;
};


export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  onClickOutside: () => void,
  options: Options = { closeOnEscape: true },
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClickOutside();
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    if (options.closeOnEscape) {
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      // if (options.closeOnEscape)
    };
  }, []);
};
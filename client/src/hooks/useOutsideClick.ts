import { useEffect, useRef, MutableRefObject } from "react";

function useOutsideClick<T extends HTMLElement>(
  handler: () => void,
  listenCapturing = true,
): MutableRefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("click", handleClickOutside, listenCapturing);
    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside,
        listenCapturing,
      );
    };
  }, [handler, listenCapturing]);

  return ref;
}

export { useOutsideClick };

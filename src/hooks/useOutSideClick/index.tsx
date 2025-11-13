import { RefObject, useState, useEffect, useCallback } from "react";

type UseOutSideClickProps = {
  ref: RefObject<HTMLElement | null>;
};

const useOutSideClick = ({ ref }: UseOutSideClickProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    },
    [ref]
  );

  const handleToggle = () => {
    setOpen((prevState) => !prevState);
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [handleClickOutside, handleClose]);

  return { open, handleToggle, handleClose, handleOpen };
};

export default useOutSideClick;

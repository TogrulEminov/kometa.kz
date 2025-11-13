import { create } from "zustand";

interface PopoverState {
  openPopovers: Record<string, boolean>;
  togglePopover: (id: string) => void;
  openPopover: (id: string) => void;
  closePopover: (id: string) => void;
  closeAll: () => void;
  isOpen: (id: string) => boolean;
}

export const usePopoverStore = create<PopoverState>((set, get) => ({
  openPopovers: {},

  togglePopover: (id) =>
    set((state) => ({
      openPopovers: {
        ...state.openPopovers,
        [id]: !state.openPopovers[id],
      },
    })),

  openPopover: (id) =>
    set((state) => ({
      openPopovers: {
        ...state.openPopovers,
        [id]: true,
      },
    })),

  closePopover: (id) =>
    set((state) => ({
      openPopovers: {
        ...state.openPopovers,
        [id]: false,
      },
    })),

  closeAll: () => set({ openPopovers: {} }),

  isOpen: (id) => get().openPopovers[id] || false,
}));

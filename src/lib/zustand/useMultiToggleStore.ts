import { create } from "zustand";
interface ToggleState {
  states: Record<string, boolean>;
  toggle: (key: string) => void;
  open: (key: string) => void;

  close: (key: string) => void;
}

export const useToggleStore = create<ToggleState>((set) => ({
  states: {},

  toggle: (key) =>
    set((state) => ({
      states: {
        ...state.states,
        [key]: !state.states[key],
      },
    })),

  open: (key) =>
    set((state) => ({
      states: {
        ...state.states,
        [key]: true,
      },
    })),

  close: (key) =>
    set((state) => ({
      states: {
        ...state.states,
        [key]: false,
      },
    })),
}));

export const useToggleState = (key: string): boolean => {
  return useToggleStore((state) => state.states[key] ?? false);
};

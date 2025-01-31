import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AllSelectedState {
  allItemsSelected: boolean;
  setAllItemsSelected: (value: boolean) => void;
  toggleAllItemsSelected: () => void;
}

export const useAllSelectedStore = create<AllSelectedState>()(
  devtools((set) => ({
    allItemsSelected: false,
    setAllItemsSelected: (value) => set({ allItemsSelected: value }),
    toggleAllItemsSelected: () =>
      set((state) => ({ allItemsSelected: !state.allItemsSelected })),
  })),
);

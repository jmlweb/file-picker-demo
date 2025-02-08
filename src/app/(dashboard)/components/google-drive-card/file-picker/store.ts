import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FilePickerState {
  ids: string[];
  addId: (id: string) => void;
  removeId: (id: string) => void;
  updateIds: (
    idsToAdd: FilePickerState['ids'],
    idsToRemove: FilePickerState['ids'],
  ) => void;
  isCheckAllSelected: boolean;
  enableCheckAll: (ids: string[]) => void;
  disableCheckAll: () => void;
  reset: () => void;
}

export const useFilePickerStore = create<FilePickerState>()(
  devtools((set) => ({
    ids: [],
    addId: (id) => set((state) => ({ ids: [...state.ids, id] })),
    removeId: (id) =>
      set((state) => ({
        ids: state.ids.filter((i) => i !== id),
        isCheckAllSelected: false,
      })),
    updateIds: (idsToAdd, idsToRemove) =>
      set((state) => {
        if (!idsToAdd.length && !idsToRemove.length) {
          return state;
        }

        const stateSet = new Set(state.ids);
        idsToRemove.forEach((id) => stateSet.delete(id));
        idsToAdd.forEach((id) => stateSet.add(id));
        return { ids: Array.from(stateSet) };
      }),
    isCheckAllSelected: false,
    enableCheckAll: (ids) => set({ isCheckAllSelected: true, ids }),
    disableCheckAll: () => set({ isCheckAllSelected: false, ids: [] }),
    reset: () => set({ ids: [], isCheckAllSelected: false }),
  })),
);

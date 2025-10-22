import { create } from "zustand";

type MemoryId = string;

type SelectionStore = {
  selectedIds: Set<MemoryId>;
  selectionMode: boolean;
  toggleSelection: (id: MemoryId) => void;
  selectAll: (ids: MemoryId[]) => void;
  clearSelection: () => void;
  enterSelectionMode: () => void;
  exitSelectionMode: () => void;
  isSelected: (id: MemoryId) => boolean;
};

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  selectedIds: new Set(),
  selectionMode: false,

  toggleSelection: (id) =>
    set((state) => {
      const newSelected = new Set(state.selectedIds);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return { selectedIds: newSelected };
    }),

  selectAll: (ids) => set({ selectedIds: new Set(ids) }),

  clearSelection: () => set({ selectedIds: new Set() }),

  enterSelectionMode: () => set({ selectionMode: true }),

  exitSelectionMode: () =>
    set({ selectionMode: false, selectedIds: new Set() }),

  isSelected: (id) => get().selectedIds.has(id),
}));

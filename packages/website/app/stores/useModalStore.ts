import { create } from "zustand";

type MemoryData = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tags?: string[];
  date?: Date;
  summary?: string;
  url?: string;
};

type ModalStore = {
  isOpen: boolean;
  memoryData: MemoryData | null;
  openModal: (data: MemoryData) => void;
  closeModal: () => void;
  updateMemoryTags: (tags: string[]) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  memoryData: null,
  openModal: (data) => set({ isOpen: true, memoryData: data }),
  closeModal: () => set({ isOpen: false, memoryData: null }),
  updateMemoryTags: (tags) =>
    set((state) => ({
      memoryData: state.memoryData ? { ...state.memoryData, tags } : null,
    })),
}));

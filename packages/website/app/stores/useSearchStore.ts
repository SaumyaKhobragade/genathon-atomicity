import { create } from "zustand";

type SearchStore = {
  searchQuery: string;
  searchResults: string[];
  isSearching: boolean;
  searchFilters: {
    tags: string[];
    emotions: string[];
    dateRange: {
      start: Date | null;
      end: Date | null;
    };
  };
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: string[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  addTagFilter: (tag: string) => void;
  removeTagFilter: (tag: string) => void;
  addEmotionFilter: (emotion: string) => void;
  removeEmotionFilter: (emotion: string) => void;
  setDateRange: (start: Date | null, end: Date | null) => void;
  clearFilters: () => void;
  clearSearch: () => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: "",
  searchResults: [],
  isSearching: false,
  searchFilters: {
    tags: [],
    emotions: [],
    dateRange: {
      start: null,
      end: null,
    },
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSearchResults: (results) => set({ searchResults: results }),

  setIsSearching: (isSearching) => set({ isSearching }),

  addTagFilter: (tag) =>
    set((state) => ({
      searchFilters: {
        ...state.searchFilters,
        tags: [...state.searchFilters.tags, tag],
      },
    })),

  removeTagFilter: (tag) =>
    set((state) => ({
      searchFilters: {
        ...state.searchFilters,
        tags: state.searchFilters.tags.filter((t) => t !== tag),
      },
    })),

  addEmotionFilter: (emotion) =>
    set((state) => ({
      searchFilters: {
        ...state.searchFilters,
        emotions: [...state.searchFilters.emotions, emotion],
      },
    })),

  removeEmotionFilter: (emotion) =>
    set((state) => ({
      searchFilters: {
        ...state.searchFilters,
        emotions: state.searchFilters.emotions.filter((e) => e !== emotion),
      },
    })),

  setDateRange: (start, end) =>
    set((state) => ({
      searchFilters: {
        ...state.searchFilters,
        dateRange: { start, end },
      },
    })),

  clearFilters: () =>
    set({
      searchFilters: {
        tags: [],
        emotions: [],
        dateRange: {
          start: null,
          end: null,
        },
      },
    }),

  clearSearch: () =>
    set({
      searchQuery: "",
      searchResults: [],
      isSearching: false,
    }),
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SearchType = 'all' | 'movie' | 'tv';

interface SearchState {
  query: string;
  type: SearchType;
  searchHistory: string[];
  setQuery: (query: string) => void;
  setType: (type: SearchType) => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      query: '',
      type: 'all',
      searchHistory: [],
      setQuery: (query) => set({ query }),
      setType: (type) => set({ type }),
      addToHistory: (query) =>
        set((state) => {
          const newHistory = [query, ...state.searchHistory.filter((q) => q !== query)].slice(0, 10);
          return { searchHistory: newHistory };
        }),
      clearHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'search-storage',
    }
  )
); 
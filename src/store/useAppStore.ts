import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SearchHistoryItem {
    uid: number;
    name: string;
    lat: number;
    lon: number;
    aqi: string;
    timestamp: number;
}

interface AppState {
    searchHistory: SearchHistoryItem[];
    addToHistory: (item: Omit<SearchHistoryItem, 'timestamp'>) => void;
    clearHistory: () => void;
    lastMapCenter: [number, number];
    setLastMapCenter: (center: [number, number]) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            searchHistory: [],
            addToHistory: (item) => set((state) => {
                const newItem = { ...item, timestamp: Date.now() };
                // Remove duplicates by uid
                const filtered = state.searchHistory.filter((i) => i.uid !== item.uid);
                // Add to top, keep max 10
                return { searchHistory: [newItem, ...filtered].slice(0, 10) };
            }),
            clearHistory: () => set({ searchHistory: [] }),
            lastMapCenter: [20, 0], // World view
            setLastMapCenter: (center) => set({ lastMapCenter: center }),
        }),
        {
            name: 'aqi-app-storage',
        }
    )
)

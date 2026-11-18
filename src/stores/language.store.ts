import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type TLanguagePreference = 'en' | 'pt-BR' | 'system';

interface ILanguageState {
  preference: TLanguagePreference;
  setPreference: (preference: TLanguagePreference) => void;
}

export const useLanguageStore = create<ILanguageState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => {
        set({ preference });
      },
    }),
    {
      name: 'movie-track:language',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

import { create } from "zustand";

interface OnboardingStore {
  onTourComplete: (() => void) | null;
  setOnTourComplete: (callback: (() => void) | null) => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  onTourComplete: null,
  setOnTourComplete: (callback) => set({ onTourComplete: callback }),
}));

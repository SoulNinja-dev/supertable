import { create } from "zustand";

type FormBuilderTab = "form" | "settings" | "preview";

interface FormBuilderStore {
  currentTab: FormBuilderTab;
  setCurrentTab: (tab: FormBuilderTab) => void;
}

export const useFormBuilderStore = create<FormBuilderStore>()((set) => ({
  currentTab: "form",
  setCurrentTab: (currentTab) => set({ currentTab }),
}));
import { create } from "zustand";
import { FullFormObject } from "~/models/form";

interface FormStore {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  form: FullFormObject;
  setForm: (form: FullFormObject) => void;
}

export const useFormStore = create<FormStore>()((set) => ({
  form: {
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "",
    connectWallet: false,
    contraints: "",
    description: "",
    fields: [],
    headerImage: "",
    seoDescription: "",
    seoImage: "",
    theme: "",
    tableId: "",
    submitMsg: "",
    slug: "",
  },
  setForm: (form) => set({ form }),
  loading: true,
  setLoading: (loading) => set({ loading }),
}));

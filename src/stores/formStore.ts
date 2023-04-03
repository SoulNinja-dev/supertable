import { create } from "zustand";
import { type FullFormObject } from "~/models/form";

interface FormStore {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  form: FullFormObject;
  setForm: (form: FullFormObject) => void;
  setFormFields: (fields: FullFormObject["fields"]) => void;
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
    theme: "classic",
    themeColor: "#3F51B5",
    tableId: "",
    submitMsg: "",
    slug: "",
    coverImage: "",
  },
  setForm: (form) => set({ form }),
  setFormFields: (fields) => set(state => ({ form: { ...state.form, fields } })),
  loading: true,
  setLoading: (loading) => set({ loading }),
}));

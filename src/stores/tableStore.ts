import { create } from "zustand";
import { FullTableObject } from "~/models/table";

interface TableStore {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  table: FullTableObject;
  setTable: (table: FullTableObject) => void;
  updateTableForm: (data: {
    id: string;
    title: string;
    // description: string;
  }) => void;
}

export const useTableStore = create<TableStore>()((set) => ({
  table: {
    id: "",
    name: "",
    description: "",
    fields: [],
    airtable: "",
    forms: [],
    updatedAt: new Date(),
    createdAt: new Date(),
    customDomain: "",
  },
  updateTableForm: ({ id, title }) => {
    set((state) => {
      const forms = state.table.forms.map((form) => {
        if (form.id === id) {
          return {
            ...form,
            title,
          };
        }
        return form;
      });
      return {
        ...state,
        table: {
          ...state.table,
          forms,
        },
      };
    });
  },
  setTable: (table) => set({ table }),
  loading: true,
  setLoading: (loading) => set({ loading }),
}));

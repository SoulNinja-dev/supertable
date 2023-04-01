import { create } from 'zustand';
import { FullTableObject } from '~/models/table';

interface TableStore {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  table: FullTableObject;
  setTable: (table: FullTableObject) => void;
}

export const useTableStore = create<TableStore>()(
  (set) => ({
    table: {
      id: '',
      name: '',
      description: '',
      fields: [],
      airtable: '',
      forms: [],
      updatedAt: new Date(),
      createdAt: new Date(),
      theme: '',
      seoImage: '',
      seoDescription: '',
    },
    setTable: (table) => set({ table }),
    loading: true,
    setLoading: (loading) => set({ loading }),
  }),
)
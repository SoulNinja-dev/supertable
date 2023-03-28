import { create } from 'zustand';
import { TableObject } from '~/models/table';

interface TableStore {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  table: TableObject;
  setTable: (table: TableObject) => void;
}

export const useTableStore = create<TableStore>()(
  (set) => ({
    table: {
      id: '',
      name: '',
      description: '',
      fields: [],
    },
    setTable: (table) => set({ table }),
    loading: true,
    setLoading: (loading) => set({ loading }),
  }),
)
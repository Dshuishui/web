import { defineStore } from 'pinia';

export const useTestStore = defineStore({
  id: 'test',
  state: () => ({
    list: [] as any[],
    current: {} as any
  }),
  getters: {
    getList: (state: any) => {
      return state.list
    }
  },
  actions: {
    setList(_list: any) {
      this.list = _list;
    },
    setCurrent(_payload: any) {
      this.current = _payload
    }
  },
});

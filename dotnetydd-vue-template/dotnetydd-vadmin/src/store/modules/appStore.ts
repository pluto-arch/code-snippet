import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => {
    return {
      count: 0,
    };
  },
  actions: {
    inc(value: number) {
      this.count += value;
    },
    dec(value: number) {
      this.count -= value;
    },
  },
});

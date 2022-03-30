import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: 123,
    permissions: [],
    firstName: null,
    lastName: null,
    tz: null,
    lang: null,
    uuid: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
});

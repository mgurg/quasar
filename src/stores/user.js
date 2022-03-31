import { defineStore } from 'pinia';
import { api } from "boot/axios";

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
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
    async fetchUsers(email,password,permanent) {
      try {
        const body = {
          "email": email,
          "password": password,
          "permanent": permanent
        }
        console.log(body)
        const data = await api.post('/auth/login',body)
        console.log(data.data)
          this.token = data.data.auth_token
          this.firstName = data.data.auth_token
          this.lastName = data.data.auth_token
          this.tz = data.data.auth_token
          this.lang = data.data.auth_token

          if (permanent == true) {
            localStorage.setItem("klucz", data.data.auth_token);
          } else {
            sessionStorage.setItem("klucz", data.data.auth_token);
          }
          return('OK')
        }
        catch (error) {
          // alert(error)
          // console.log(error.data)
          // throw error;
          if (error.response) {
            console.log(error.response.data.detail);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("General Error");
          }
          throw error.response.data.detail;
      }
    }
  },
});

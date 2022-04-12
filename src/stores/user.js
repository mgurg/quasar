import { defineStore } from 'pinia';
import { api } from "boot/axios";

export const useUserStore = defineStore('user', {
  state: () => ({
    token: (localStorage.getItem('klucz') || null),
    permissions: [],
    firstName: (localStorage.getItem('firstName') || null),
    lastName: (localStorage.getItem('klucz') || null),
    tz: (localStorage.getItem('tz') || null),
    lang: (localStorage.getItem('lang') || null),
    uuid: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    increment() {
      this.counter++;
    },
    async loginUsers(email,password,permanent) {
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
            sessionStorage.removeItem("klucz");
          } else {
            sessionStorage.setItem("klucz", data.data.auth_token);
            localStorage.removeItem("klucz");
          }
          localStorage.removeItem("klucz");
          localStorage.removeItem("tz");
          localStorage.removeItem("lang");
          localStorage.removeItem("firstName");
          localStorage.removeItem("lastName");

          sessionStorage.removeItem("klucz");
          localStorage.setItem("klucz", data.data.auth_token);
          localStorage.setItem("tz", data.data.tz);
          localStorage.setItem("lang", data.data.lang);
          localStorage.setItem("firstName", data.data.first_name);
          localStorage.setItem("lastName", data.data.last_name);
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
    },

    fillStore(token,firstName,lastName, tz,lang ){
      this.token = token
      this.firstName = firstName
      this.lastName = lastName
      this.tz = tz
      this.lang = lang
    },

    async autoLogin() {
      // if (localStorage.getItem("klucz") === null){
      //   var token = sessionStorage.getItem("klucz");
      // } else{
      //   var token = localStorage.getItem("klucz");
      // }
      if (sessionStorage.getItem("klucz") !== null) {
        console.log('AutoLogin Start')
        await api
          .get("/auth/verify/" + token)
          .then((res) => {
            console.log('token')
            if (res.data.ok == true) {
              this.token = token
              console.log('token valid: ', token)            }
            else{
              this.logoutUser()
            }
            // return('OK');
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response.data.detail);
            } else if (err.request) {
              console.log(err.request);
            } else {
              console.log("General Error");
            }
          });
      }
    },

    async logoutUser() {
      localStorage.removeItem("klucz");
      localStorage.removeItem("tz");
      localStorage.removeItem("lang");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      sessionStorage.removeItem("klucz");
      this.token = null
    },
  },
});

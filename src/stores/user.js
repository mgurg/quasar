import { defineStore } from 'pinia';
import { api } from "boot/axios";

export const useUserStore = defineStore('user', {
  state: () => ({
    token: (localStorage.getItem('klucz') || null),
    permissions: (localStorage.getItem('permissions') || []),
    firstName: (localStorage.getItem('firstName') || null),
    lastName: (localStorage.getItem('lastName') || null),
    tz: (localStorage.getItem('tz') || null),
    lang: (localStorage.getItem('lang') || null),
    uuid: (localStorage.getItem('uuid') || null),
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,

    getToken: (state) => state.token,
    getPermissions: (state) => state.permissions,

    getCurrentUserId: (state) => state.uuid,
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
          this.firstName = data.data.first_name
          this.lastName = data.data.last_name
          this.tz = data.data.tz
          this.lang = data.data.lang
          this.uuid = data.data.uuid
          this.permissions = data.data.role_FK.permission.map((a) => a.name)

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
          localStorage.removeItem("uuid");

          sessionStorage.removeItem("klucz");
          localStorage.setItem("klucz", data.data.auth_token);
          localStorage.setItem("tz", data.data.tz);
          localStorage.setItem("lang", data.data.lang);
          localStorage.setItem("firstName", data.data.first_name);
          localStorage.setItem("lastName", data.data.last_name);
          localStorage.setItem("uuid", data.data.last_name);
          localStorage.setItem("permissions", data.data.role_FK.permission.map((a) => a.name));
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
      localStorage.removeItem("uuid");
      localStorage.removeItem("permissions");
      sessionStorage.removeItem("klucz");
      this.token = null
    },
  },
});

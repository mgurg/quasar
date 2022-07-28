import { boot } from "quasar/wrappers";
import axios from "axios";
import { useUserStore } from 'stores/user'


// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// const api = axios.create({ baseURL: 'https://api.example.com' })


const api = axios.create({ baseURL: process.env.VUE_APP_URL });
const noAuthApi = axios.create();

// const authApi = axios.create({ baseURL: process.env.VUE_APP_URL })
// authApi.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('klucz');

// const token = localStorage.getItem('klucz');

const authApi = axios.create({
  baseURL: process.env.VUE_APP_URL,
  // headers: {
  //   'Authorization': 'Bearer ' + localStorage.getItem('klucz')
  // },
});

export default boot(({ app, router }) => {
  const UserStore = useUserStore();

  authApi.interceptors.request.use((req) => {
    // `req` is the Axios request config, so you can modify
    // the `headers`.
    if (localStorage.getItem("klucz") === null){
      var token = sessionStorage.getItem("klucz");
    } else{
      var token = localStorage.getItem("klucz");
    }
    if (localStorage.getItem("tenant") === null){
      var tenant = sessionStorage.getItem("tenant");
    } else{
      var tenant = localStorage.getItem("tenant");
    }
    req.headers.authorization = "Bearer " + token;
    req.headers.tenant = tenant;
    return req;
  });

  authApi.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response.status === 401) {
        // deleteUserToken();
        // history.push(Routes.Login);
        console.log("unauth interceptor " + err.response.status);
        UserStore.logoutUser();
        router.replace("/login");
      }
      return Promise.reject(err);
    }
  );

  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, authApi, noAuthApi };
